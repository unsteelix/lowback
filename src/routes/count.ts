import { Request, Response } from 'express';
import { trimDataPath } from '../utils';
import { contentDB as DBC } from '../database';

const countRoute = (req: Request, res: Response) => {
    const { params }: any = req;
    const path = trimDataPath(`/${params[0]}`);
  
    const count = DBC.count(path);
    res.json(count)
}

export default countRoute