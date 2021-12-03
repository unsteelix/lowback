import express from 'express';
import bodyParser from 'body-parser';
//import pino from 'pino-http';
import Database from "./database";
//import logger from '/logger';
import log from "./logger";
import { trimDataPath } from "./utils";
const PORT = 8000;
const DB_filepath = 'DB.json';
const DB = new Database(DB_filepath);
const app = express();
// middlewares
//app.use(pino())
app.use(bodyParser.json());
// router
app.get('/live', (_req, res) => {
    res.send('Server is live');
});
app.post('/push/*', (req, res) => {
    const { params } = req;
    const path = trimDataPath(`/${params[0]}`);
    const data = req.body;
    const newData = DB.push(path, data);
    res.json(newData);
});
app.post('/merge/*', (req, res) => {
    const { params } = req;
    const path = trimDataPath(`/${params[0]}`);
    const data = req.body;
    const newData = DB.merge(path, data);
    res.json(newData);
});
app.get('/delete/*', (req, res) => {
    const { params } = req;
    const path = trimDataPath(`/${params[0]}`);
    DB.delete(path);
    res.json(true);
});
app.get('/count/*', (req, res) => {
    const { params } = req;
    const path = trimDataPath(`/${params[0]}`);
    const count = DB.count(path);
    res.json(count);
});
app.get('/index/custom/*/:index/:propName', (req, res) => {
    const { params } = req;
    const path = trimDataPath(`/${params[0]}`);
    const index = params['index'];
    const propName = params['propName'];
    const indexEl = DB.index(path, index, propName);
    res.json(indexEl);
});
app.get('/index/*/:index', (req, res) => {
    const { params } = req;
    const path = trimDataPath(`/${params[0]}`);
    const index = params['index'];
    const indexEl = DB.index(path, index);
    res.json(indexEl);
});
app.get('/reload', (_req, res) => {
    DB.reload();
    res.json(true);
});
app.get('/*', (req, res) => {
    const url = trimDataPath(req.url);
    const data = DB.get(url);
    res.json(data);
});
app.listen(PORT, () => {
    //console.log('\n\n', app, '\n\n')
    log.info(`[SERVER]: Server is running at https://localhost:${PORT}`);
});
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
/**
 * [GET]  /*
 * [POST] /push/*
 * [POST] /merge/*
 * [GET]  /delete/*
 *
 * [GET]  /count/*
 * [GET]  /index/*
 * [GET]  /reload
 *
 * [GET]  /auth/*
 *
 *
 *
 *
 *
 */ 
//# sourceMappingURL=index.js.map