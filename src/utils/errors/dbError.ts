/* eslint-disable constructor-super */
import mongoose from 'mongoose';
import { HttpStatus, THttpStatus } from '../httpStatuses';
import HttpError from './httpError';

export default class DbError extends HttpError {
  constructor(err: mongoose.Error) {
    super(DbError.resolveStatus(err));
    this.name = 'DbError';
    Object.setPrototypeOf(this, DbError.prototype);
  }

  private static resolveStatus(err: mongoose.Error | mongoose.mongo.MongoServerError | Error): THttpStatus {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      return HttpStatus.NotFound;
    }

    if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {
      return HttpStatus.BadRequest;
    }

    if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
      return HttpStatus.Conflict;
    }

    return HttpStatus.InternalServerError;
  }
}
