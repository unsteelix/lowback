import Database from '/database';

console.log(22222222233)

const DB = new Database("myDataBase2.json");

const data = DB.get("/");

console.log(data);