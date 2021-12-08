import { NextFunction, Request, Response } from 'express';
import { trimDataPath } from '../utils';
import { contentDB as DBC } from '../database';

const countRoute = (req: Request, res: Response, next: NextFunction) => {
    try {

        const { params }: any = req;
        const path = trimDataPath(`/${params[0]}`);
      
        const count = DBC.count(path);
        res.json(count)
        
    } catch(e) {
        next(e)
    }
}

export default countRoute