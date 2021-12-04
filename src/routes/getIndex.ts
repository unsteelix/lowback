import { Request, Response } from 'express';
import { trimDataPath } from '../utils';
import DB from '../database';

const indexRoute = (req: Request, res: Response) => {
    const { params }: any = req;

    const path = trimDataPath(`/${params[0]}`);
    const index = params['index'];
  
    const indexEl = DB.index(path, index);
    res.json(indexEl)
}

export default indexRoute