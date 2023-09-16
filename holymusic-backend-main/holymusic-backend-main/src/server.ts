import app from '@/app';
import { logger } from '@/utils/logger';
import { PORT } from '@config';
import { connect } from '@/databases/mongo';
import validateEnv from '@/utils/validateEnv';
import routes from './routes';
import { fallback } from '@/controllers';
/**
 * Validate Environment Variables
 */
validateEnv();
/**
 * Connect to MongoDB
 */
connect();

const version = '/v1';
routes.forEach((route) => {
  const path = version + route.path;
  app.use(path, route.func);
});
app.all('*', fallback);
//
// LISTEN PORT
app.listen(PORT, () => {
  logger.info(`·•· ·•· ·•· ·•· ·•· ·•· ·•· ·•· ·•·`);
  logger.warn(`App is running on http://localhost:${PORT}`);
  logger.info(`·•· ·•· ·•· ·•· ·•· ·•· ·•· ·•· ·•·`);
});
