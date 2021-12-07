import { Request, Response } from 'express';
import { serviceDB as DBS } from '../database';

const authRoute = (req: Request, res: Response) => {
    const { params }: any = req;
    const { site, password } = params;

    const tokens = DBS.get(`/tokens/${site}/${password}`);
  
    res.json(tokens)
}

export default authRoute