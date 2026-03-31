import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import 'dotenv/config';

import { SessionRequest } from '../utils/types';
import HttpError from '../utils/errors/httpError';
import { HttpStatus } from '../utils/httpStatuses';

const { JWT_SECRET } = process.env;

export default (req: Request, res: Response, next: NextFunction) => {
  const sessionReq = req as SessionRequest;
  const token = sessionReq.cookies.jwt;

  if (!token) return next(new HttpError(HttpStatus.Unauthorized));

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET as Secret);
  } catch {
    return next(new HttpError(HttpStatus.Unauthorized));
  }

  sessionReq.user = { _id: (payload as JwtPayload)._id };

  return next();
};
