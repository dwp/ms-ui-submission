const Logger = require('../../lib/Logger');

const appLogger = Logger();

module.exports = (router) => {
  router.get('/', (req, res) => {
    appLogger.info(`${req.method}: /`);
    res.redirect('/who-is-applying');
  });
};
