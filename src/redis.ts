import Redis from 'ioredis';
import { config } from './config';
import { logger } from './utils/logger';

const redis = new Redis(config.redis);
redis.on('connect', () => {
  logger.info(`Redis is listening at ${config.redis.host}:${config.redis.port}`);
});

redis.on('error', (err) => {
  logger.error(`❌ Redis connection error: ${err}`);
});
