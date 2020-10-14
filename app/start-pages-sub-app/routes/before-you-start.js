const Logger = require('../../lib/Logger');

const appLogger = Logger();

module.exports = (router) => {
  router.get('/before-you-start', (req, res) => {
    appLogger.info(`${req.method}: /before-you-start`);
    let firstPage = false;
    if (req.session) {
      firstPage = req.session.historyStack.length > 0;
    }
    res.render('before-you-start.njk', { renderBackLink: firstPage });
  });
};
