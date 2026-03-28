import { THttpStatusCode, THttpStatusMessage } from '../httpStatuses';

export default class HttpError extends Error {
  code: THttpStatusCode;

  constructor(status: { code: THttpStatusCode; message: THttpStatusMessage; }) {
    super(status.message);
    this.name = 'HttpError';
    this.code = status.code;
    this.stack = `${this.name}: ${this.message}`;
  }
}
