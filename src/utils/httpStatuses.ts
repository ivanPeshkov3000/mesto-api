export const HttpStatus = {
  Ok: { code: 200, message: 'OK' },
  Created: { code: 201, message: 'Created' },
  BadRequest: { code: 400, message: 'Bad Request' },
  Unauthorized: { code: 401, message: 'Unauthorized' },
  Forbidden: { code: 403, message: 'Forbidden' },
  NotFound: { code: 404, message: 'Not Found' },
  Conflict: { code: 409, message: 'Conflict' },
  InternalServerError: { code: 500, message: 'Internal Server Error' },
} as const;

export type THttpStatusCode = typeof HttpStatus[keyof typeof HttpStatus]['code'];
export type THttpStatusMessage = typeof HttpStatus[keyof typeof HttpStatus]['message'];
export type THttpStatus = typeof HttpStatus[keyof typeof HttpStatus];
