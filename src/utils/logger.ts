import pino, { LoggerOptions } from 'pino';
import { config } from '../config';

const pinoOptions: LoggerOptions = {
  level: config.app.env === 'production' ? 'info' : 'debug',
};

if (config.app.env !== 'production') {
  pinoOptions.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  };
}

export const logger = pino(pinoOptions);
