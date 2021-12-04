import { Request, Response } from 'express';

const liveRoute = (_req: Request, res: Response) => {
    res.send('Server is live')
}

export default liveRoute