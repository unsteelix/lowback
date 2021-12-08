import { Request, Response, NextFunction } from 'express';
import { checkReadRights, checkWriteRights, isRouteDB, getDBMethodType, getPathFromDBroute, getTokenRights, isPublicPath, parseTokenFromReq } from '../utils';
//import log from '../logger';
//import { contentDB as DB } from '../database';

/**
 * authorization Database middleware
 */
 const authDB = (req: Request, _res: Response, next: NextFunction) => {
    try {

        /**
         * is DB route
         */
        if(isRouteDB(req)) {
            const methodType = getDBMethodType(req);

            /**
             * PUBLIC paths
             */
            const isPublic = isPublicPath(req);
            if(methodType === 'read' && isPublic){
                return next()
            }

            /**
             * PRIVATE paths
             */
            const token = parseTokenFromReq(req);
            if(token) {

                const path = getPathFromDBroute(req);
                const rights = getTokenRights(token)

                if(methodType === 'read') {
                
                    if(!checkReadRights(path, rights)){
                        throw new Error(`You dont have access READ. But have in ${rights['read']}`)
                    }

                } else if (methodType === 'write') {

                    if(!checkWriteRights(path, rights)){
                        throw new Error(`You dont have access WRITE. But have in ${rights['write']}`)
                    }

                }

            }


        }

        return next()

    } catch(e) {
        next(e)
    }
}

export default authDB;