import mongoose from 'mongoose';
import { config } from '../config';
import { logger } from './logger';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.db.uri, {
      autoIndex: config.app.env !== 'production',
      maxPoolSize: 10,
    });
    logger.info('✅ Connected to MongoDB');
  } catch (error) {
    logger.error('❌ MongoDB connection failed');
    logger.error(error);
    process.exit(1);
  }
};
