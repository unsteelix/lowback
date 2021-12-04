import { Request, Response } from 'express';
import { trimDataPath } from '../utils';
import DB from '../database';

const indexCustomRoute = (req: Request, res: Response) => {
    const { params }: any = req;

    const path = trimDataPath(`/${params[0]}`);
    const index = params['index'];
    const propName = params['propName'];
  
    const indexEl = DB.index(path, index, propName);
    res.json(indexEl)
}

export default indexCustomRoute