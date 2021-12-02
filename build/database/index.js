import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import log from "../logger";
class Database {
    filepath;
    db;
    constructor(filepath) {
        if (!filepath) {
            throw new Error('Filepath to DB not found');
        }
        this.filepath = filepath;
        try {
            this.db = new JsonDB(new Config(filepath, true, true, '/'));
        }
        catch (e) {
            log.fatal(e);
            throw new Error(e.message);
        }
        log.info('Initialization DB');
    }
    get(path) {
        log.info('[GET] ' + path);
        try {
            const data = this.db.getData(path);
            log.info(data);
            return data;
        }
        catch (e) {
            log.error(e.message);
            throw new Error(e.message);
        }
    }
    push(path, data) {
        log.info('[PUSH] ' + path);
        log.info(data);
        try {
            this.db.push(path, data);
            return this.db.getData(path);
        }
        catch (e) {
            log.error(e.message);
            throw new Error(e.message);
        }
    }
    merge(path, data) {
        log.info('[MERGE] ' + path);
        log.info(data);
        try {
            this.db.push(path, data, false);
            return this.db.getData(path);
        }
        catch (e) {
            log.error(e.message);
            throw new Error(e.message);
        }
    }
    delete(path) {
        log.info('[DELETE] ' + path);
        this.checkPath(path);
        try {
            this.db.delete(path);
            return true;
        }
        catch (e) {
            log.error(e.message);
            throw new Error(e.message);
        }
    }
    reload() {
        this.db.reload();
        log.info('DB was reload');
    }
    checkPath(path) {
        try {
            this.db.getData(path);
        }
        catch (e) {
            log.error(e.message);
            throw new Error(e.message);
        }
    }
}
export default Database;
//# sourceMappingURL=index.js.map