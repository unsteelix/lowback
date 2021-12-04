import express from 'express';
import bodyParser from 'body-parser';
import log from './logger';
import router from './routes';
import config from './config';

const app = express();

// middlewares
app.use(bodyParser.json())

// router
app.get('/live', router.liveRoute);

app.get('/get/*', router.getRoute);

app.post('/push/*', router.pushRoute);

app.post('/merge/*', router.mergeRoute);

app.get('/delete/*', router.deleteRoute);

app.get('/count/*', router.countRoute);

app.get('/index/custom/*/:index/:propName', router.indexCustomRoute);

app.get('/index/*/:index', router.indexRoute);

app.get('/reload', router.reloadRoute);

app.get('/backup', router.backupRoute)


// server
app.listen(config.PORT, () => {
  log.info(`[SERVER]: Server is running at http://localhost:${config.PORT}`);
});







// DB.get("/test3/users[1]");
// DB.get("/test3/users/2");

// DB.merge("/list", ["newsss"]);

// DB.merge("/test3", {
//     users: ['DOWN']
// });

// DB.delete('/test3/users[4]')

// const res = DB.count('/test3/users');
// const res = DB.index('/test3/users', 'myI', 'name')

// console.log(res)


/**
 * [GET]  /get/* 
 * [POST] /push/*
 * [POST] /merge/*
 * [GET]  /delete/*
 * 
 * [GET]  /count/*
 * [GET]  /index/*
 * [GET]  /index/custom/*
 * [GET]  /reload
 * [GET]  /backup
 * 
 * [GET]  /auth/*
 * 
 * 
 * 
 * 
 * 
 */