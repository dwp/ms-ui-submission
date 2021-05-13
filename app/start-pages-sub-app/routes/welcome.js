const Logger = require('../../lib/Logger');

const appLogger = Logger();

module.exports = (router) => {
  router.get('/welcome', (req, res) => {
    appLogger.info(`${req.method}: /welcome`);
    res.redirect('/eligibility-start');
  });
};
