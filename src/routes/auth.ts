import { NextFunction, Request, Response } from 'express';
import { serviceDB as DBS } from '../database';

const authRoute = (req: Request, res: Response, next: NextFunction) => {
    try {

        const { params }: any = req;
        const { site, password } = params;
    
        const tokens = DBS.get(`/tokens/${site}/${password}`);
      
        res.json(tokens)
        
    } catch(e) {
        next(e)
    }
}

export default authRoute