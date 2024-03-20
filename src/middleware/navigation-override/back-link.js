import Logger from '../../lib/logger.js';
import { JourneyContext } from '@dwp/govuk-casa';

const appLogger = Logger();

export default (req, res, next) => {
  if (req.session.backClicked !== true) {
    req.session.historyStack = req.session.historyStack || [];
    if (req.session.nextBackLink !== undefined && req.session.nextBackLink !== req.path) {
      appLogger.info(`Add ${req.session.nextBackLink} to req.session.historyStack`);
      req.session.historyStack.push({
        path: req.session.nextBackLink,
      });
    }
  }

  if (req.session.backClicked === true && req.session.nextBackLink === '/disability-or-health-condition'
    && req.casa.journeyContext.data['eligibility-start'] !== undefined) {
    req.casa.journeyContext.data['eligibility-start'] = { visited: false };
  }
  if (req.session.nextBackLink === '/helping-someone-apply' && req.casa.journeyContext.data['help-someone-apply'] !== undefined) {
    req.journeyContext.data['help-someone-apply'] = { visited: true };
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
  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save(next);
};
