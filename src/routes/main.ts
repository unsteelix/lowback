import { NextFunction, Request, Response } from 'express';
import log from '../logger';
import path from 'path';

const mainRoute = (_req: Request, res: Response, next: NextFunction) => {
    try {

        log.info('[PAGE MAIN]');
    
        const __dirname = path.resolve();
    
        res.sendFile(path.join(__dirname, 'src/pages', 'pageAuth.html'))

    } catch(e: any) {
        next(e)
    }
}

export default mainRoute