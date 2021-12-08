import { NextFunction, Request, Response } from 'express';
import path from 'path';
import log from '../logger';
import config from '../config'

const backupRoute = (_req: Request, res: Response, next: NextFunction) => {
    try {

        log.info('[BACKUP]');
    
        const __dirname = path.resolve();
    
        res.sendFile(path.join(__dirname, config.contentDB_filepath))
        
    } catch(e) {
        next(e)
    }
}

export default backupRoute