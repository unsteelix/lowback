import { Request, Response } from 'express';
import DB from '../database';

const authRoute = (req: Request, res: Response) => {
    const { params }: any = req;
    const { site, password } = params;

    const tokens = DB.get(`/tokens/${site}/${password}`);
  
    res.json(tokens)
}

export default authRoute