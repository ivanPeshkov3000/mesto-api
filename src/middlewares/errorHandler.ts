import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { isCelebrateError } from 'celebrate';

import HttpError from '../utils/errors/httpError';
import { HttpStatus } from '../utils/httpStatuses';
import DbError from '../utils/errors/dbError';

function normalizeError(err: unknown): HttpError {
  if (err instanceof HttpError) { return err; }

  if (isCelebrateError(err)) {
    const message = [...err.details.values()][0]?.message || 'Validation error';
    return new HttpError(HttpStatus.BadRequest.code, message);
  }

  if (err instanceof mongoose.Error || err instanceof mongoose.mongo.MongoServerError) {
    return new DbError(err);
  }

  return new HttpError(HttpStatus.InternalServerError);
}

export default (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const httpError: HttpError = normalizeError(err);
  res.status(httpError.code).json({ message: httpError.message });
};
