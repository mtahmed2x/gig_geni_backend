import http from 'http';
import app from './app';
import { config } from './config/index';

import { initSocket } from './socket';
import { connectDB } from './utils/mongoose';
import {
  bootstrapAdmin,
  bootstrapContact,
  bootstrapPrivacyPolicy,
  bootstrapTermsAndConditions,
} from './utils/seed';
import { logger } from './utils/logger';

const server = http.createServer(app);

async function startServer() {
  try {
    await connectDB();
    await bootstrapAdmin();
    await bootstrapContact();
    await bootstrapTermsAndConditions();
    await bootstrapPrivacyPolicy();

    server.listen(config.app.port, () => {
      logger.info(`🚀 Server running on port ${config.app.port}`);
    });

    initSocket(server);
  } catch (err) {
    logger.error(`❌ Failed to start server: ${err}`);
    process.exit(1);
  }
}

startServer();
