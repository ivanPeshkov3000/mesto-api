import { HttpStatus } from '../httpStatuses';
import HttpError from './httpError';

export default class AuthError extends HttpError {
  constructor() {
    super(HttpStatus.Unauthorized);
    this.name = 'AuthError';
  }
}
