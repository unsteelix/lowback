import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
//import errorhandler  from 'errorhandler';
import log from './logger';
import router from './routes';
import config from './config';
import { initializeDBSkeleton } from './utils';
import authAPI from './middleWares/authAPI';
import authDB from './middleWares/authDB';
import errorResponder from './middleWares/errorResponder';



const app = express();

// middlewares
app.use(bodyParser.json())
app.use(fileUpload());
app.use(authAPI)
app.use(authDB)


// router
app.get('/', router.mainRoute);

app.get('/get/*', router.getRoute);

app.post('/push/*', router.pushRoute);

app.post('/merge/*', router.mergeRoute);

app.get('/delete/*', router.deleteRoute);

app.get('/count/*', router.countRoute);

app.get('/index/custom/*/:index/:propName', router.indexCustomRoute);

app.get('/index/*/:index', router.indexRoute);

app.get('/reload', router.reloadRoute);

app.get('/backup', router.backupRoute)

app.get('/page/upload', router.pageUploadRoute)

app.post('/upload/files', router.uploadFilesRoute)

app.post('/upload/images', router.uploadImagesRoute)

app.get('/files/:id', router.filesRoute);

app.get('/images/:id', router.imagesRoute);

app.get('/images/:id/:version', router.imagesRoute);

app.get('/auth/:site/:password', router.authRoute);

app.get('*', router.notFoundRoute);

app.use(errorResponder)


// server
app.listen(config.PORT, () => {
  log.info(`[SERVER]: Server is running at http://localhost:${config.PORT}`);
  initializeDBSkeleton()
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
 * [OPEN]   [GET]  /live 
 * 
 * [ANY]    [GET]  /get/* 
 * [ANY]    [POST] /push/*
 * [ANY]    [POST] /merge/*
 * [ANY]    [GET]  /delete/*
 * 
 * [ANY]    [GET]  /count/*
 * [ANY]    [GET]  /index/*
 * [ANY]    [GET]  /index/custom/*
 * [MASTER] [GET]  /reload
 * [MASTER] [GET]  /backup
 * 
 * [MASTER] [GET]  /page/upload
 * 
 * [ANY]    [POST] /upload/files
 * [ANY]    [POST] /upload/images
 * 
 * [OPEN]   [GET]  /files/:id
 * [OPEN]   [GET]  /images/:id
 * [OPEN]   [GET]  /images/:id/:version
 * 
 * [OPEN]   [GET]  /auth/:site/:password
 * 
 * 
 * 
 * 
 *        level 1:    проверка доступа к определенным API методам
 *        level 2:    проверка доступа к контентной части БД
 * 
 *        level 1: 
 * 
 *          роуты доступны только по токену
 *          /public работает только для чтения. Указывает роуты БД доступные без токена
 * 
 *            - [OPEN]   открытые (без необходимости в токене)
 *            - [MASTER] только с MASTER TOKEN
 *            - [ANY]    с любым сюществующим токеном
 *        
 *          
 *        level 2: 
 *            
 *          -read: /get
 *            -show
 *            -hide
 *            -secret
 *          -write: /push /merge /delete
 *           
 * 
 */