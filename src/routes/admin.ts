import { NextFunction, Request, Response } from 'express';
import { trimDataPath } from '../utils';
import { contentDB as DBC, filesDB as DBF, serviceDB as DBS } from '../database';

const adminRoute = (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const { params }: any = req;
        
        const db: string = params['db'];
        const method: string = params['method'];

        const DBmap: {
            [key: string]: typeof DBC | typeof DBF | typeof DBS 
        } = {
            dbc: DBC,
            content: DBC,
            dbf: DBF,
            files: DBF,
            dbs: DBS,
            service: DBS
        }

        const selectedDB = DBmap[db]

        if(!selectedDB){
            throw new Error(`DB "${db}" not found. Try: "dbc", "dbf", "dbs", "content", "files", "service"`)
        }

        if(!(method === 'get' || method === 'push' || method === 'merge' || method === 'delete')){
            throw new Error(`method "${method}" not found. Try: "get", "push", "merge", "delete"`)
        }

        const path = trimDataPath(`/${params[0]}`);
      
        const data = req.body;

        let newData = null

        switch(method){

            case 'get':
                newData = selectedDB.get(path);
                res.json(newData)
            break;

            case 'push':
                newData = selectedDB.push(path, data);
                res.json(newData)
            break;

            case 'merge':
                newData = selectedDB.merge(path, data);
                res.json(newData)
            break;

            case 'delete':
                selectedDB.delete(path);
                res.json(true)
            break;

        }

    } catch(e) {
        next(e)
    }
}

export default adminRoute