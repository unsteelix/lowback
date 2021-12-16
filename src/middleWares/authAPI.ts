import { Request, Response, NextFunction } from 'express';
import { parseTokenFromReq, isTokenExist, getMasterToken, isPublicPath } from '../utils';
import log from '../logger';

const APImap: any = {
    '/live': ['OPEN', 'GET'],
    '/get/': ['ANY', 'GET'],
    '/push/': ['ANY', 'POST'],
    '/merge/': ['ANY', 'POST'],
    '/delete/': ['ANY', 'GET'],
    '/count/': ['ANY', 'GET'],
    '/index/': ['ANY', 'GET'],
    '/index/custom/': ['ANY', 'GET'],
    '/reload': ['MASTER', 'GET'],
    '/backup/': ['MASTER', 'GET'],
    '/page/upload': ['MASTER', 'GET'],
    '/upload/files': ['ANY', 'POST'],
    '/upload/images': ['ANY', 'POST'],
    '/files/': ['OPEN', 'GET'],
    '/images/': ['OPEN', 'GET'],
    '/auth/': ['OPEN', 'GET'],
    '/admin/': ['MASTER', 'POST']
}

/**
 * Authorization middleware for API methods
 */
 const authAPI = (req: Request, _res: Response, next: NextFunction) => {
     try {

        const { url, method } = req; 

        /**
         * check public paths for /get route
         */
        const isPublic = isPublicPath(req);
        if(isPublic) {
            log.warn(`[PUBLIC] ${url}`)
            return next()
        }
    
        /**
         * Check Method and Rights for each API
         */
        for(let route in APImap) {
            if(url.indexOf(route) === 0){
                const [tokenRight, userMethod] = APImap[route]
                
                if(userMethod !== method) {
                    throw new Error(`Method [${method}] not allowed for "${route}" route. Try [${userMethod}]`)
                }
    
                if(tokenRight === 'OPEN') {
                    log.warn(`[PUBLIC] ${url}`)
                    return next()
    
                } 
                
                if(tokenRight === 'MASTER') {
                    
                    const token = parseTokenFromReq(req);
                    const masterToken = getMasterToken();
    
                    if(!token){
                        throw new Error(`This route "${route} allowed only with token"`)
                    }
                    
                    if(token === masterToken){
                        log.warn(`[PRIVATE] ${url}`)
                        return next()
                    } else {
                        throw new Error(`only MASTER TOKEN allowed for route "${route}"`)
                    }
    
                }
    
                if(tokenRight === 'ANY') {
                    
                    const token = parseTokenFromReq(req);
    
                    if(!token){
                        throw new Error(`This route "${route} allowed only with token"`)
                    }
    
                    if(isTokenExist(token) ){
                        log.warn(`[PRIVATE] ${url}`)
                        return next()
                    }
    
                }
    
            }
        }
    
        return next()
        
     } catch(e) {
         next(e)
     }
}

export default authAPI;