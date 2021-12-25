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
import cors from 'cors';

import serveStatic from 'serve-static';
import path from 'path';
const __dirname = path.resolve();

const app = express();

// middlewares
app.use(cors())


app.use(serveStatic(path.join(__dirname, 'volume/files')))


app.use(bodyParser.json({
  limit: 100 * 1000 * 1000,    // max size of string, 100mb
  strict: false                // for passing string in body
}))
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

app.get('/page/:page', router.pageRoute)

app.post('/upload/files', router.uploadFilesRoute)

app.post('/upload/images', router.uploadImagesRoute)

app.get('/files/:id', router.filesRoute);

app.get('/images/:id', router.imagesRoute);

app.get('/images/:id/:version', router.imagesRoute);

app.get('/auth/:site/:password', router.authRoute);

app.post('/admin/:db/:method/*', router.adminRoute);


app.get('*', router.notFoundRoute);

app.use(errorResponder)


// server
app.listen(config.PORT, () => {
  log.info(`[SERVER]: Server is running at http://localhost:${config.PORT}`);
  initializeDBSkeleton()
});