import { Request, Response } from 'express';
import { trimDataPath } from '../utils';
import DB from '../database';

const countRoute = (req: Request, res: Response) => {
    const { params }: any = req;
    const path = trimDataPath(`/${params[0]}`);
  
    const count = DB.count(path);
    res.json(count)
}

export default countRoute