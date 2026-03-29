import { connectDB } from './config/db';
import { env } from './config/env';
import { logger } from './config/logger';
import app from './app';

const start = async (): Promise<void> => {
  await connectDB();

  app.listen(env.PORT, () => {
    logger.info(`🚀 Pride Auto Store API running on http://localhost:${env.PORT}`);
    logger.info(`📦 Environment: ${env.NODE_ENV}`);
  });
};

start().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
