import { Request, Response } from 'express';
import { contentDB as DBC, serviceDB as DBS, filesDB as DBF } from '../database';

const reloadRoute = (_req: Request, res: Response) => {

    DBC.reload();
    DBS.reload();
    DBF.reload();
    
    res.json(true)
}

export default reloadRoute