import liveRoute from './live';
import pushRoute from './push';
import mergeRoute from './merge';
import deleteRoute from './delete';
import countRoute from './count';
import indexCustomRoute from './getCustomIndex';
import indexRoute from './getIndex';
import reloadRoute from './reload';
import getRoute from './get';
import backupRoute from './backup';

const router = {
    liveRoute,
    pushRoute,
    mergeRoute,
    deleteRoute,
    countRoute,
    indexCustomRoute,
    indexRoute,
    reloadRoute,
    getRoute,
    backupRoute
}

export default router