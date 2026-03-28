/* eslint-disable constructor-super */
import mongoose from 'mongoose';
import { HttpStatus } from '../httpStatuses';
import HttpError from './httpError';

export default class DbError extends HttpError {
  constructor(err: mongoose.Error) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      super(HttpStatus.NotFound);
    } else if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error.CastError) {
      super(HttpStatus.BadRequest);
    } else { super(HttpStatus.InternalServerError); }
    this.name = 'DbError';
  }
}
