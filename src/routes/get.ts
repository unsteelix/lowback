import { NextFunction, Request, Response } from 'express';
import { getDataWithHiddenPaths, isSecretPath, parseTokenFromReq, getTokenRights, isPublicPath, isInsideSecretPath } from '../utils';
import { contentDB as DBC } from '../database';

const getRoute = (req: Request, res: Response, next: NextFunction) => {
    try {

        const { params }: any = req;
        const path = `/${params[0]}`;
    
        /**
         * PUBLIC path
         */
        if(isPublicPath(req)) {
            const data = DBC.get(path);
            res.json(data)
            return        
        }
    
        const token = parseTokenFromReq(req);
    
        if(token) {

            /**
             * SECRET path
             */
            if(isSecretPath(req)) {
                res.json()
                return
            }

            /**
             * INSIDE of SECRET path
             */
            if(isInsideSecretPath(req)){
                const data = DBC.get(path);
                res.json(data)
                return
            }
    
            /**
             * OUTSIDE of SECRET path
             */
            const hideRights = getTokenRights(token, 'hide')
            const data = getDataWithHiddenPaths(path, hideRights); // SHOW / HIDE
    
            res.json(data)
            return
        }

    } catch(e: any) {
        next(e)
    }
}

export default getRoute