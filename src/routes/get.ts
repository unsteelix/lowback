import { Request, Response } from 'express';
import { getDataWithHiddenPaths, isSecretPath, getSecretPathByDataPath, parseTokenFromReq, isPathConsist, getTokenRights } from '../utils';
import { contentDB as DBC } from '../database';

const getRoute = (req: Request, res: Response) => {
    const { params }: any = req;
    const path = `/${params[0]}`;

    /**
     * SECRET path
     */
    if(isSecretPath(req)) {
        res.json()
        return
    }

    const token = parseTokenFromReq(req);

    if(token) {
        /**
         * inside of secret path
         */
        const secretPath = getSecretPathByDataPath(token, path)
        if(secretPath){
            if(isPathConsist(path, secretPath)) {

                const diff = path.length - secretPath.length;

                if(diff >= 2) {
                    const data = DBC.get(path);
                    res.json(data)
                    return
                }
            }
        }

        /**
         * SHOW / HIDE
         * outide of secret path
         */
        const hideRights = getTokenRights(token, 'hide')
        const data = getDataWithHiddenPaths(path, hideRights);

        res.json(data)
        return
    }
}

export default getRoute