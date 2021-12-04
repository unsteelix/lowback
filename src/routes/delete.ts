import { Request, Response } from 'express';
import { trimDataPath } from '../utils';
import DB from '../database';

const deleteRoute = (req: Request, res: Response) => {
    const { params }: any = req;
    const path = trimDataPath(`/${params[0]}`);
  
    DB.delete(path);
    res.json(true)
}

export default deleteRoute