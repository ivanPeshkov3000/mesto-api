import { NextFunction, Request, Response } from 'express';
import HttpError from '../utils/errors/httpError';
import { HttpStatus } from '../utils/httpStatuses';

export default (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const httpError = err instanceof HttpError ? err : new HttpError(HttpStatus.InternalServerError);
  res.status(httpError.code).json({ message: httpError.message });
};
