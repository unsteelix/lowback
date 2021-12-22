import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { uid } from 'uid/secure';
import { filesDB as DBF } from '../database'
import { files_path } from '../config';
import log from '../logger';
import { getImgDimensions } from '../utils';

const __dirname = path.resolve();

const uploadFilesRoute = (req: Request, res: Response, next: NextFunction) => {
    try {

        log.info('[UPLOAD FILES]');
    
        if(!req.files || Object.keys(req.files).length === 0){    
            throw new Error('must be at least one file')
        }
    
        /**
         * список массивов, где каждый массив это одна <input type="file" /> форма
         */
        const forms: any[] = Object.values(req.files);
    
        /**
         * объединяем все файлы из всех форм в один список
         */
        let files: any[] = forms.flat(); 
    
        /**
         * перемещаем файл
         * добавляем в БД 
         */
        let listRes: any[] = [];
        const listPromise: any[] = [];
    
        files.forEach((file: any) => {
    
            const { name, size, mimetype } = file;
    
            const id = uid(14);
    
            const format = name.split('.')[name.split('.').length - 1]
            const newName = `${id}.${format}`;
            
            const uploadPath = path.join(__dirname , files_path, newName);

            const type = mimetype.split('/')[0]
            const date = new Date()
    
            const promise = new Promise((resolve, reject) => {
                file.mv(uploadPath, async (err: any) => {
                    if (err) {
                        const val = {
                            status: "error",
                            value: err.message
                        }
                        listRes.push(val)
    
                        reject(val)
    
                    } else {
    
                        const dimensions = await getImgDimensions(uploadPath);

                        const val = {
                            status: "success",
                            value: {
                                id,
                                name,
                                size,
                                format,
                                mimetype,
                                type,
                                date,
                                data: {
                                    ...dimensions
                                }
                            }
                        }
    
                        DBF.push(`/${id}`, {
                            originalName: name,
                            format,
                            size,
                            date,
                            mimetype,
                            type,
                            data: {
                                ...dimensions
                            }
                        })
                        listRes.push(val)
    
                        resolve(val)
    
                    }
                });
            });
    
            listPromise.push(promise)
        })
    
        Promise.all(listPromise).then(() => {
            res.send(listRes)
        }).catch(e => {
            throw new Error(e.message)
        })
        
    } catch(e) {
        next(e)
    }
}

export default uploadFilesRoute