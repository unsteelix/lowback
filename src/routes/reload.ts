import { Request, Response } from 'express';
import DB from '../database';

const reloadRoute = (_req: Request, res: Response) => {

    DB.reload();
    res.json(true)
}

export default reloadRoute