import { NextFunction, Request, Response } from 'express';
import path from 'path';
import log from '../logger';

const pageRoute = (req: Request, res: Response, next: NextFunction) => {
    try {

        const { params }: any = req;
        const page = params['page'];

        log.info(`[PAGE ${page}]`);
    
        const __dirname = path.resolve();
    
        const pageMap: any = {
            auth: 'pageAuth.html',
            upload: 'pageUpload.html',
            admin: 'pageAdmin.html'
        }

        const selectedPage = pageMap[page]

        if(!selectedPage){
            throw new Error(`page ${page} not found. Try: "auth", "upload", "admin"`)
        }

        res.sendFile(path.join(__dirname, 'src/pages', selectedPage))
        
    } catch(e) {
        next(e)
    }
}

export default pageRoute