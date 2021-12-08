import { NextFunction, Request, Response } from 'express';
import { trimDataPath } from '../utils';
import { contentDB as DBC } from '../database';

const indexRoute = (req: Request, res: Response, next: NextFunction) => {
    try {

        const { params }: any = req;

        const path = trimDataPath(`/${params[0]}`);
        const index = params['index'];
      
        const indexEl = DBC.index(path, index);
        res.json(indexEl)
        
    } catch(e) {
        next(e)
    }
}

export default indexRoute