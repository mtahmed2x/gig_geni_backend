import { Queue } from 'bullmq';
import redis from '../redis';

export const emailQueue = new Queue('email-sending', {
  connection: redis,
});

export const competitionQueue = new Queue('competition-updates', { connection: redis });

export const notificationQueue = new Queue('notification-sending', { connection: redis });
