import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import 'dotenv/config';

import { SessionRequest } from '../utils/types';
import AuthError from '../utils/errors/authError';

const { JWT_SECRET } = process.env;

export default (req: Request, res: Response, next: NextFunction) => {
  const sessionReq = req as SessionRequest;
  const token = sessionReq.cookies.jwt;

  if (!token) return next(new AuthError());

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET as Secret);
  } catch {
    return next(new AuthError());
  }

  sessionReq.user = { _id: (payload as JwtPayload)._id };

  return next();
};
