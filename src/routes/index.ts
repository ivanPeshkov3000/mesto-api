import { Router } from 'express';

import users from './users.router';
import cards from './cards.router';
import HttpError from '../utils/errors/httpError';
import { HttpStatus } from '../utils/httpStatuses';

const publicRouter = Router();
const protectedRouter = Router();
const notFoundRouter = Router();

publicRouter.use('/', users.publicRouter, cards.publicRouter);
protectedRouter.use('/', users.protectedRouter, cards.protectedRouter);
// 404
notFoundRouter.all('/', (req, res, next) => {
  next(new HttpError(HttpStatus.NotFound));
});

export { publicRouter, protectedRouter, notFoundRouter };
