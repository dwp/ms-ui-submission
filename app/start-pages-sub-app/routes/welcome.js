const Logger = require('../../lib/Logger');

const appLogger = Logger();

module.exports = (router) => {
  router.get('/welcome', (req, res) => {
    appLogger.info(`${req.method}: /welcome`);
    let firstPage = false;
    if (req.session) {
      firstPage = req.session.historyStack.length > 0;
    }
    res.render('welcome.njk', { renderBackLink: firstPage });
  });
};
