import { NextFunction, Request, Response } from 'express';
import { contentDB as DBC, serviceDB as DBS, filesDB as DBF } from '../database';

const reloadRoute = (_req: Request, res: Response, next: NextFunction) => {
    try {

        DBC.reload();
        DBS.reload();
        DBF.reload();
        
        res.json(true)
        
    } catch(e) {
        next(e)
    }
}

export default reloadRoute