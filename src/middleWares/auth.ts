import { Request, Response, NextFunction } from 'express';
import { parseTokenFromReq, isRouteDB, isTokenExist, getMasterToken } from '../utils';
import log from '../logger';
import DB from '../database';

/**
 * authorization middleware
 */
 const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {

    const { url } = req; 

    /**
     * check public paths for /get route
     */
    if(url.indexOf('/get/') === 0) {
        const publicPaths = DB.get('/public');
        const path = url.slice(4, url.length);

        publicPaths.forEach((publicPath: string) => {
            log.warn(path)
            log.warn(publicPath)
            if(path?.indexOf(publicPath) === 0) {
                next()
            } 
        });
    }

    const token = parseTokenFromReq(req);
    
    if(!token) {
        throw new Error('token not found')
    }

    const publicRoutes = [
        '/',
        '/live'
    ]

    let isPublicRoute = false;

    publicRoutes.forEach(route => {
        if(url === route){
            isPublicRoute = true;
        }
    })
    if(url.indexOf('/auth/') === 0) {
        isPublicRoute = true;
    }

    /**
     * private routes
     */
    if(!isPublicRoute) {
        log.warn(`[PRIVATE] ${url}`)

        /**
         * is DB route
         */
        if(isRouteDB(req)) {
            log.warn('d00000o boute')
        }

        if(isTokenExist(token)) {
            console.log('\n\n---', isTokenExist(token), '-\n\n')
        }

        /**
         * is master token
         */
        if(token === getMasterToken()){
            log.warn('-----------    MASTER    ------')
        }



        //checkAccessRights()




    } else {
        log.warn(`[PUBLIC] ${url}`)
    }

    next()
}

export default authMiddleware;