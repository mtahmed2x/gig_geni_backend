import { Worker, Job } from 'bullmq';

import { updateQuizPoints } from '../modules/competition/competition.service';
import { logger } from '../utils/logger';
import redis from '../redis';

logger.info('Starting competition worker...');

const worker = new Worker(
  'competition-updates',
  async (job: Job) => {
    logger.info(`Processing job '${job.name}' with ID ${job.id}`);

    if (job.name === 'update-total-points') {
      const { competitionId } = job.data;

      if (!competitionId) {
        throw new Error(`Job ${job.id} is missing a competitionId.`);
      }

      await updateQuizPoints(competitionId);
    }
  },
  { connection: redis },
);

worker.on('completed', (job: Job) => {
  logger.info({ jobId: job.id, jobName: job.name }, 'Job completed successfully.');
});

worker.on('failed', (job: Job | undefined, err: Error) => {
  logger.error({ jobId: job?.id, jobName: job?.name, error: err }, 'Job failed.');
});

// process.on('SIGINT', () => worker.close());
// process.on('SIGTERM', () => worker.close());
