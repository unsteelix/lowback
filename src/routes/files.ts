import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { filesDB as DBF } from '../database';
import log from '../logger';

const filesRoute = (req: Request, res: Response, next: NextFunction) => {
    try {

        const { params }: any = req;
        const id = params['id'];
    
        log.info(`[FILES] ${id}`);
        
        const __dirname = path.resolve();
    
        const filePath = DBF.get(`/files/${id}/name`)
    
        res.sendFile(path.join(__dirname, 'files', filePath))
        
    } catch(e) {
        next(e)
    }
}

export default filesRoute