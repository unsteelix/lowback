import Database from '/database';
//import log from '/logger';

const DB = new Database("DB.json");

DB.get("/test3/users");
// DB.get("/test3/users[1]");
// DB.get("/test3/users/2");

// DB.merge("/list", ["newsss"]);

// DB.merge("/test3", {
//     users: ['DOWN']
// });

//DB.delete('/test3/users[4]')

//const res = DB.count('/test3/users');
//const res = DB.index('/test3/users', 'myI', 'name')

//console.log(res)