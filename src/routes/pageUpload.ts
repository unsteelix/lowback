import { Request, Response } from 'express';
import path from 'path';
import log from '../logger';

const pageUploadRoute = (_req: Request, res: Response) => {
    log.info('[PAGE UPLOAD]');
    
    const __dirname = path.resolve();

    res.sendFile(path.join(__dirname, 'src/pages', 'pageUpload.html'))
}

export default pageUploadRoute