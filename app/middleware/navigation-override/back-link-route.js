const url = require('url');
const Logger = require('../../lib/Logger');

const appLogger = Logger();

module.exports = (router) => {
  router.get('/back', (req, res) => {
    appLogger.info('GET: back');
    if (req.session.historyStack && req.session.historyStack.length > 0) {
      const redirectPath = req.session.historyStack.pop().path;
      req.session.backClicked = true;
      appLogger.info(`redirecting to ${redirectPath}`);
      req.session.save(() => {
        res.status(302).redirect(redirectPath);
      });
    } else {
      const referrer = req.get('Referrer');
      if (url.parse(referrer).host === req.headers.host) {
        appLogger.info(`redirecting back to ${referrer}`);
        res.status(302).redirect(referrer);
      } else {
        appLogger.info('Possible open redirect attempt. redirecting to /');
        res.status(302).redirect('/');
      }
    }
  });
};
