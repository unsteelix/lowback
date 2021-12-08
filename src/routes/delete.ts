import { NextFunction, Request, Response } from 'express';
import { trimDataPath } from '../utils';
import { contentDB as DBC } from '../database';

const deleteRoute = (req: Request, res: Response, next: NextFunction) => {
    try {

        const { params }: any = req;
        const path = trimDataPath(`/${params[0]}`);
      
        DBC.delete(path);
        res.json(true)
        
    } catch(e) {
        next(e)
    }
}

export default deleteRoute