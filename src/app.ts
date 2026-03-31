import express from 'express';
import { connect } from 'mongoose';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

import authGuard from './middlewares/auth-guard';
import { startLogger, requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/errorHandler';
import { publicRouter, protectedRouter, notFoundRouter } from './routes';

const port = 8000;
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
});

app.use(express.json()); // Парсим json
app.use(helmet()); // Настройка заголовков
app.use(limiter); // Ограничиваем запросы
app.use(cookieParser()); // парсер кук
app.use(requestLogger); // логер запросов

app.use(publicRouter);
app.use(authGuard);
app.use(protectedRouter);
app.use(notFoundRouter);

app.use(errorLogger); // логер ошибок
app.use(errors);
app.use(errorHandler);

connect('mongodb://localhost:27017/test')
  .then(() => { startLogger.info('MongoDB connected!'); })
  .catch((err) => { startLogger.error(`MongoDB connection error: ${err}`); });
app.listen(port, (err) => {
  if (err) {
    return startLogger.error(`Server start error: ${err}`);
  }
  return startLogger.info(`Server run on port: ${port}!`);
});
