import { NextFunction, Request, Response } from 'express';
import path from 'path';
import log from '../logger';
import config from '../config'

const backupRoute = (req: Request, res: Response, next: NextFunction) => {
    try {

        log.info('[BACKUP]');
    
        const { params }: any = req;

        const type: string = params['type'];

        const typeMap: {
            [key: string]: string
        } = {
            content: config.contentDB_filepath,
            service: config.serviceDB_filepath,
            files: config.filesDB_filepath
        }

        const __dirname = path.resolve();
    
        const filePath = typeMap[type] || config.contentDB_filepath

        res.sendFile(path.join(__dirname, filePath))
        
    } catch(e) {
        next(e)
    }
}

export default backupRoute