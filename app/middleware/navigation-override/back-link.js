const Logger = require('../../lib/Logger');

const appLogger = Logger();

module.exports = (req, res, next) => {
  if (req.session.backClicked !== true) {
    req.session.historyStack = req.session.historyStack || [];
    if (req.session.nextBackLink !== undefined && req.session.nextBackLink !== req.path) {
      appLogger.info(`Add ${req.session.nextBackLink} to req.session.historyStack`);
      req.session.historyStack.push({
        path: req.session.nextBackLink,
      });
    }
  }
  if (req.session.nextBackLink === '/session-timeout') {
    appLogger.info('Restart session and history stack');
    req.session.historyStack = [];
  }
  req.session.nextBackLink = req.path;
  delete req.session.backClicked;
  next();
};
