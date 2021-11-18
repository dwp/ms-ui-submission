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
  if (req.session.backClicked === true && req.session.nextBackLink === '/coronavirus') {
    req.journeyData.setDataForPage('eligibility-start-visited', false);
  }
  if (req.session.nextBackLink === '/helping-someone-apply') {
    req.journeyData.setDataForPage('help-someone-apply-visited', true);
  }
  if (req.session.nextBackLink === '/session-timeout') {
    appLogger.info('Restart session and history stack');
    req.session.historyStack = [];
  }
  req.session.nextBackLink = req.path;
  if (req.session.backClicked && req.session.nextBackLink === '/conditions') {
    req.session.conditionBack = true;
  }
  if (req.session.backClicked && req.session.nextBackLink === '/another-health-condition') {
    req.session.anotherConditionBack = true;
  }

  delete req.session.backClicked;
  next();
};
