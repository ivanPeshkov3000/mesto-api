import winston from 'winston';
import expressWinston from 'express-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { isCelebrateError } from 'celebrate';

const isDev = process.env.NODE_ENV === 'development';

const {
  combine,
  colorize,
  errors,
  simple,
  timestamp,
  json,
  printf,
} = winston.format;
const { Console } = winston.transports;

const devConsole: any = isDev
  ? new Console({
    format: combine(
      errors({ stack: true }),
      timestamp(),
      colorize(),
      printf(({
        level, message, timeStamp, meta,
      }) => {
        const err = (meta as any)?.error;
        const req = (meta as any)?.req;

        const reqInfo = req
          ? `${req.method} ${req.originalUrl}`
          : '';

        let stack = err?.stack
          ? err.stack
            .split('\n')
            .filter((line: string) => !line.includes('node_modules'))
            .join('\n')
          : '';

        if (isCelebrateError(err)) {
          const errs: string[] = [];

          err.details.forEach((value, key) => {
            const messages = value.details.map((d) => `[${key}] ${d.message}`);
            errs.push(...messages);
          });
          stack += `\n${errs.join('\n')}`;
        }

        return `${level}: ${reqInfo} [${timeStamp}]\n${message}\n${stack}`;
      }),
    ),
  })
  : null;

// Лог запуска приложения
const startLogger = winston.createLogger({
  transports: [
    new Console({}),
  ],
  format: combine(
    colorize(),
    timestamp(),
    errors({ stack: true }),
    simple(),
  ),
});

// Лог запросов
const requestLogger = expressWinston.logger({
  level: 'info',
  transports: [
    new DailyRotateFile({
      filename: 'logs/request-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '1m',
      maxFiles: '7d',
      zippedArchive: true,
    }),
  ],
  format: combine(
    timestamp(),
    json(),
  ),
  skip: (req, res) => res.statusCode >= 500,
});

// Лог ошибок запросов
const errorLogger = expressWinston.errorLogger({
  level: 'error',
  transports: [
    new DailyRotateFile({
      filename: 'logs/request-error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      zippedArchive: true,
      level: 'error',
      format: combine(
        timestamp(),
        errors({ stack: true }),
        json(),
      ),
    }),
    devConsole,
  ],
});

export {
  startLogger,
  requestLogger,
  errorLogger,
};
