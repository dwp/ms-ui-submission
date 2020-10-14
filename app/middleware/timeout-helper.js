const Logger = require('../lib/Logger');

const appLogger = Logger();

module.exports = (router) => {
  router.use((req, res, next) => {
    appLogger.info('running session timeout helper');
    let sessionTimeout = 0;
    let sessionExpiry = false;
    if (req.session && req.session.dateExpire) {
      sessionExpiry = req.session.dateExpire;
    }
    if (process.env && process.env.SESSIONS_TTL) {
      sessionTimeout = Math.round(process.env.SESSIONS_TTL / 60);
    }
    if (res.locals) {
      res.locals.timeout = {
        packageVersion: process.env.npm_package_version || '1',
        sessionTimeout,
        sessionExpiry,
        refreshDestination: req.url || '/',
        startPageAfterTimeout: 'eligibility-start',
      };
    }
    next();
  });
};
