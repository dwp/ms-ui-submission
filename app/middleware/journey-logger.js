const Logger = require('../lib/Logger');

const logger = Logger();

module.exports = (router) => {
  router.use((req, res, next) => {
    logger.info(`${req.method}: ${req.path}`);
    next();
  });
};
