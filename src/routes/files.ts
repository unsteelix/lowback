import { Request, Response } from 'express';
import path from 'path';
import DB from '../database';
import log from '../logger';

const filesRoute = (req: Request, res: Response) => {
    const { params }: any = req;
    const id = params['id'];

    log.info(`[FILES] ${id}`);
    
    const __dirname = path.resolve();

    const filePath = DB.get(`/files/${id}/name`)

    res.sendFile(path.join(__dirname, 'files', filePath))
}

export default filesRoute