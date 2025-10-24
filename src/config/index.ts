import dotenv from 'dotenv';
import path from 'path';
import nodemailer from 'nodemailer';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  app: {
    port: Number(process.env.PORT) || 5000,
    socketPort: Number(process.env.SOCKET_PORT) || 6000,
    env: process.env.NODE_ENV || 'development',
  },
  db: {
    uri: process.env.MONGO_URI!,
  },
  admin: {
    email: process.env.ADMIN_EMAIL!,
    password: process.env.ADMIN_PASSWORD!,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'access',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  redis: {
    host: process.env.REDIS_HOST || '0.0.0.0',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  },
};

export const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
