import { Request, Response } from 'express';
import { trimDataPath } from '../utils';
import DB from '../database';

const getRoute = (req: Request, res: Response) => {
    const { params }: any = req;
    const path = trimDataPath(`/${params[0]}`);

    const data = DB.get(path);
  
    res.json(data)
}

export default getRoute