import { THttpStatus, THttpStatusCode } from '../httpStatuses';

export default class HttpError extends Error {
  code: THttpStatusCode;

  constructor(status: THttpStatus);

  constructor(code: THttpStatusCode, message: string);

  constructor(statusOrCode: THttpStatus | THttpStatusCode, message?: string) {
    if (typeof statusOrCode === 'object' && 'code' in statusOrCode) {
      super(statusOrCode.message);
      this.code = statusOrCode.code;
    } else {
      super(message);
      this.code = statusOrCode;
    }

    this.name = 'HttpError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
