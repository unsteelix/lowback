import { Request, Response } from 'express';
import path from 'path';
import DB from '../database';
import log from '../logger';

const versions = [
    'optimized', 'w1920', 'w1280', 'w640'
]

const imagesRoute = (req: Request, res: Response) => {
    const { params }: any = req;
    const id = params['id'];
    const version = params['version'];

    log.info(`[IMAGES] ${id} ${version ? version : ''}`);
    
    const __dirname = path.resolve();

    let filePath = null;

    /**
     * original
     */
    if(!version){
        filePath = DB.get(`/files/${id}/name`)
    } else {
        
        /**
         * originalOptimized | w1920 | w1280 | w640
         */
        if(!versions.includes(version)){
            throw new Error(`modificator "${version}" not exist. Available: "optimized", "w1920", "w1280", "w640"`)
        }

        filePath = DB.get(`/files/${id}/data/${version}`)
    }

    res.sendFile(path.join(__dirname, 'files', filePath))
}

export default imagesRoute