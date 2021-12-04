import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
import log from '../logger';
import config from '../config'

class Database {

    filepath: string;
    db: any;

    constructor(filepath: string) {
        if(!filepath) {
            throw new Error('Filepath to DB not found')
        }
        this.filepath = filepath;

        try {
            this.db = new JsonDB(new Config(filepath, true, true, '/'));
        } catch(e: any) {
            log.fatal(e)
            throw new Error(e.message)
        }
        log.info('Initialization DB')
    }

    get(path: string) {
        log.info('[GET] ' + path)

        try {
            const data = this.db.getData(path);
            log.info(data)
            return data;
        } catch(e: any) {
            log.error(e.message)
            throw new Error(e.message)
        }
    }

    push(path: string, data: any) {
        log.info('[PUSH] ' + path)
        log.info(data)

        try {
            this.db.push(path, data);
            return this.db.getData(path)
        } catch(e: any) {
            log.error(e.message)
            throw new Error(e.message)
        }
    }

    merge(path: string, data: any) {
        log.info('[MERGE] ' + path)
        log.info(data)

        try {
            this.db.push(path, data, false);
            return this.db.getData(path)
        } catch(e: any) {
            log.error(e.message)
            throw new Error(e.message)
        }
    }

    delete(path: string) {
        log.info('[DELETE] ' + path)
        this.checkPath(path);

        try {
            this.db.delete(path);
            return true
        } catch(e: any) {
            log.error(e.message)
            throw new Error(e.message)
        }
    }
    
    count(path: string) {
        log.info('[COUNT] ' + path)

        try {
            return this.db.count(path);
        } catch(e: any) {
            log.error(e.message)
            throw new Error(e.message)
        }
    }

    index(path: string, index: string | number, propertyName?: string) {
        log.info(`[INDEX] ${path} ${index}${propertyName ? ' ' + propertyName : ''}`)

        try {
            let value = null;

            if(propertyName){
                value = this.db.getIndex(path, index, propertyName);
            } else {
                value = this.db.getIndex(path, index);
            }

            if (value === -1) {
                return null
            }

            return value

        } catch(e: any) {
            log.error(e.message)
            throw new Error(e.message)
        }
    }

    reload() {
        try {
            this.db.reload();
            log.info('DB was reload')
            return true
        } catch(e: any) {
            log.error(e.message)
            throw new Error(e.message)
        }
    }

    checkPath(path: string) {
        try {
            this.db.getData(path)
        } catch(e: any) {
            log.error(e.message)
            throw new Error(e.message)
        }
    }

}

const DB = new Database(config.DB_filepath);

export default DB