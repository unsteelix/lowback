import { NextFunction, Request, Response } from 'express';
//import log from '../logger';

/**
 * Error catcher middleware
 */
const errorResponder = (error: any, _req: Request, res: Response, _next: NextFunction) => {
    
    res.status(500).send(error.message)
  }

export default errorResponder;