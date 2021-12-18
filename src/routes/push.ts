import { NextFunction, Request, Response } from 'express';
import { trimDataPath } from '../utils';
import { contentDB as DBC } from '../database';

const pushRoute = (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { params }: any = req;
        const path = trimDataPath(`/${params[0]}`);
      
        const data = req.body;
      
        const newData = DBC.push(path, data);
        res.json(newData)

    } catch(e) {
        next(e)
    }
}

export default pushRoute