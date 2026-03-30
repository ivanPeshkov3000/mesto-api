import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { isCelebrateError } from 'celebrate';

import HttpError from '../utils/errors/httpError';
import { HttpStatus } from '../utils/httpStatuses';
import DbError from '../utils/errors/dbError';

export default (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let httpError: HttpError;
  if (err instanceof HttpError) {
    httpError = err;
  } else if (isCelebrateError(err)) {
    const message = [...err.details.values()][0].message || 'Validation error';
    httpError = new HttpError(HttpStatus.BadRequest.code, message);
  } else if (err instanceof mongoose.Error || err instanceof mongoose.mongo.MongoServerError) {
    httpError = new DbError(err);
  } else {
    httpError = new HttpError(HttpStatus.InternalServerError);
  }
  res.status(httpError.code).json({ message: httpError.message });
};
