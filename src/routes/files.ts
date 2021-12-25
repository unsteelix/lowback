import { NextFunction, Request, Response } from 'express';
//import path from 'path';
import { filesDB as DBF } from '../database';
//import { files_path } from '../config';
import log from '../logger';

const filesRoute = (req: Request, res: Response, next: NextFunction) => {
    try {

        const { params }: any = req;
        const id = params['id'];
    
        log.info(`[FILES] ${id}`);
        
        // const __dirname = path.resolve();
    
        // const fileName = id + '.' + DBF.get(`/${id}/format`)
    
        // res.sendFile(path.join(__dirname, files_path, fileName))

        const data = DBF.get(`/${id}`)
        res.json(data)
        
    } catch(e) {
        next(e)
    }
}

export default filesRoute