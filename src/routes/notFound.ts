import { NextFunction, Request, Response } from 'express';

const notFoundRoute = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send(`API "${req.path}" Not Found`)
    } catch(e: any) {
        next(e)
    }
}

export default notFoundRoute