import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
class Database {
    filepath;
    db;
    constructor(filepath) {
        this.filepath = filepath;
        this.db = new JsonDB(new Config(filepath, true, true, '/'));
        console.log(filepath, this.db);
    }
    get(path) {
        const data = this.db.getData(path);
        return data;
    }
    reload() {
        this.db.reload();
    }
}
export default Database;
//# sourceMappingURL=index.js.map