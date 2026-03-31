import { NextFunction, Response, Request } from 'express';

export default function promiseCatch(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
