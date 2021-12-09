import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
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

app.get('/backup/:type', router.backupRoute)

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