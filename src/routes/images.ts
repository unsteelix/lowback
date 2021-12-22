import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { filesDB as DBF } from '../database';
import { files_path } from '../config';
import log from '../logger';

const versions = [
    'optimized', 'w1920', 'w1280', 'w640'
]

const imagesRoute = (req: Request, res: Response, next: NextFunction) => {
    try {

        const { params }: any = req;
        const id = params['id'];
        const version = params['version'];
    
        log.info(`[IMAGES] ${id} ${version ? version : ''}`);
        
        const __dirname = path.resolve();
    
        let fileName = null;
    
        /**
         * original
         */
        if(!version){
            fileName = id + '.' + DBF.get(`/${id}/format`);
        } else {
            
            /**
             * originalOptimized | w1920 | w1280 | w640
             */
            if(!versions.includes(version)){
                throw new Error(`modificator "${version}" not exist. Available: "optimized", "w1920", "w1280", "w640"`)
            }
    
            fileName = DBF.get(`/${id}/data/${version}`)
        }
    
        res.sendFile(path.join(__dirname, files_path, fileName))
        
    } catch(e) {
        next(e)
    }
}

export default imagesRoute