import { Request, Response } from 'express';
import path from 'path';
import { uid } from 'uid/secure';
import DB from '../database'
import { getImgDimensions, optimizeFiles } from '../utils';
import log from '../logger';

const __dirname = path.resolve();

const uploadImagesRoute = (req: Request, res: Response) => {
    log.info('[UPLOAD IMAGES]');
    
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

        const id = uid(32);

        const format = name.split('.')[name.split('.').length - 1]
        const newName = `${id}.${format}`;
        
        const uploadPath = path.join(__dirname , '/files/', newName);

        log.info(uploadPath)

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

                    /**
                     * get width / height of img
                     */
                    const dimensions = await getImgDimensions(`files/${newName}`);
                    const format = dimensions.width / dimensions.height;

                    /**
                     * resize and optimize
                     */
                    const optimized = await optimizeFiles(`files/${newName}`, `files/${id}_optimized.webp`)

                    const w1920 = await optimizeFiles(`files/${newName}`, `files/${id}_w1920.webp`, {width: 1920, height: 1920 / format})
                    const w1280 = await optimizeFiles(`files/${newName}`, `files/${id}_w1280.webp`, {width: 1280, height: 1280 / format})
                    const w640 = await optimizeFiles(`files/${newName}`, `files/${id}_w640.webp`, {width: 640, height: 640 / format})

                    //const extension = path.extname(optimized);

                    // const optimizedName = path.basename(optimized, extension)
                    // const w1920name = path.basename(w1920, extension);
                    // const w1280name = path.basename(w1280, extension);
                    // const w640name = path.basename(w640, extension);

                    const data = {
                        optimized,
                        w1920,
                        w1280,
                        w640
                    }

                    DB.push(`/files/${id}`, {
                        id,
                        name: newName,
                        originalName: name,
                        size,
                        mimetype,
                        type: 'image',
                        data: data
                    })

                    const val = {
                        status: "success",
                        value: {
                            id,
                            name,
                            size,
                            mimetype,
                            path: `/images/${id}`,
                            optimized: {
                                optimized: `/images/${id}/optimized`,
                                w1920: `/images/${id}/w1920`,
                                w1280: `/images/${id}/w1280`,
                                w640: `/images/${id}/w640`
                            }
                        }
                    }

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
}

export default uploadImagesRoute