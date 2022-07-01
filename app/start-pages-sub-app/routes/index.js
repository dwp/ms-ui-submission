const Logger = require('../../lib/Logger');

const appLogger = Logger();

module.exports = (router) => {
  router.get('/', (req, res) => {
    if (req.query.lang === 'cy') {
      appLogger.info(`${req.method}: /`);
      res.redirect('/who-is-applying?lang=cy');
    } else {
      appLogger.info(`${req.method}: /`);
      res.redirect('/who-is-applying');
    }
  });
};
