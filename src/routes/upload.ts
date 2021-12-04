import { Request, Response } from 'express';
import path from 'path';
import log from '../logger';

const __dirname = path.resolve();

const uploadRoute = (req: Request, res: Response) => {
    log.info('[UPLOAD]');
    
    if(!req.files || Object.keys(req.files).length === 0){    
        throw new Error('must be at least one file')
    }

    /**
     * список массивов, где каждый массив это одна <input type="file" /> форма
     */
    const forms: any[] = Object.values(req.files);

    /**
     * объединяем все формы в одну
     */
    let files: any[] = forms.flat(); 
    
    //console.log('\n\n', files, '\n\n')


    /**
     * перемещаем файл
     * добавляем в БД 
     */
    let listRes: any[] = [];
    const listPromise: any[] = [];

    files.forEach((file: any) => {

        const { name, size, mimetype } = file;
        const format = mimetype.split('/')[1];

        const uploadPath = path.join(__dirname , '/files/', `${name}.${format}`);

        log.info(uploadPath)

        const promise = new Promise((resolve, reject) => {
            file.mv(uploadPath, (err: any) => {
                if (err) {
                    const val = {
                        status: "error",
                        value: err.message
                    }
                    listRes.push(val)

                    reject(val)

                } else {
                    const val = {
                        status: "success",
                        value: {
                            name: name,
                            size: size,
                            type: mimetype,
                            path: uploadPath,
                            id: 'dfgfdg'
                        }
                    }
                    listRes.push(val)

                    resolve(val)

                }
            });
        });

        listPromise.push(promise)

        // console.log(file)
    })

    Promise.all(listPromise).then(() => {
        res.send(listRes)
    }).catch(e => {
        throw new Error(e.message)
    })
}

export default uploadRoute