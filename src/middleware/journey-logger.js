import logger from '../lib/logger.js';

const appLogger = logger();

export default (router) => {
  router.use((req, res, next) => {
    appLogger.info(`${req.method}: ${req.path}`);
    next();
  });
};
