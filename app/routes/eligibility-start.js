const Logger = require('../lib/Logger');

const appLogger = Logger();

module.exports = (router) => {
  router.get('/eligibility-start', (req, res) => {
    appLogger.info(`${req.method}: /eligibility-start`);
    res.render('pages/eligibility-start.njk');
  });
};
