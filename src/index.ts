import Database from '/database';
//import log from '/logger';

const DB = new Database("DB.json");

DB.get("/test3/users");
DB.get("/test3/users[1]");
DB.get("/test3/users/2");

//DB.push("/test3/users/2", "newsss");

DB.merge("/test3", {
    users: ['DOWN']
});

DB.delete('/test3/users/4')

//log.info(res)