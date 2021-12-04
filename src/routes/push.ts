import { Request, Response } from 'express';
import { trimDataPath } from '../utils';
import DB from '../database';

const pushRoute = (req: Request, res: Response) => {
    const { params }: any = req;
    const path = trimDataPath(`/${params[0]}`);
  
    const data = req.body;
  
    const newData = DB.push(path, data);
    res.json(newData)
}

export default pushRoute