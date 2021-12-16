import mainRoute from './main';
import pushRoute from './push';
import mergeRoute from './merge';
import deleteRoute from './delete';
import countRoute from './count';
import indexCustomRoute from './getCustomIndex';
import indexRoute from './getIndex';
import reloadRoute from './reload';
import getRoute from './get';
import backupRoute from './backup';
import pageUploadRoute from './pageUpload';
import uploadFilesRoute from './uploadFiles';
import uploadImagesRoute from './uploadImages';
import filesRoute from './files';
import imagesRoute from './images';
import authRoute from './auth';
import notFoundRoute from './notFound';
import adminRoute from './admin';

const router = {
    mainRoute,
    pushRoute,
    mergeRoute,
    deleteRoute,
    countRoute,
    indexCustomRoute,
    indexRoute,
    reloadRoute,
    getRoute,
    backupRoute,
    pageUploadRoute,
    uploadFilesRoute,
    uploadImagesRoute,
    filesRoute,
    imagesRoute,
    authRoute,
    notFoundRoute,
    adminRoute
}

export default router