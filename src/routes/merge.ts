import { Request, Response } from 'express';
import { trimDataPath } from '../utils';
import { contentDB as DBC } from '../database';

const pushRoute = (req: Request, res: Response) => {
    const { params }: any = req;
    const path = trimDataPath(`/${params[0]}`);
  
    const data = req.body;
  
    const newData = DBC.merge(path, data);
    res.json(newData)
}

export default pushRoute