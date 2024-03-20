import dataUtils from '../../../src/lib/data-utils/index.js';
import logger from '../../../src/lib/logger.js';
import { JourneyContext } from '@dwp/govuk-casa';
const appLogger = logger();

const prerender = (req, res, next) => {
  res.locals.conditionGather = req.session && req.session.conditionGather ? req.session.conditionGather : [];
  res.locals.conditionsLength = req.session.conditionGather ? req.session.conditionGather.length : 0;
  res.locals.limitReached = req.session.conditionGather ? req.session.conditionGather.length > 11 : false;
  next();
};

const preredirect = (req, res, next) => {
  appLogger.info('Navigation rules: conditions');
  const payload = req.casa.journeyContext.data;
  if (dataUtils.conditionDataUtils.getConditionsCount(req) > 11) {
    req.casa.journeyContext.setDataForPage('another-health-condition', {
      limitReached: 'yes',
      anotherCondition: 'no',
    });
  }
  if (req.session.editSection === 'condition') {
    dataUtils.conditionDataUtils.updateSpecificCondition(payload, req);
  } else if (req.casa.journeyContext.data['another-health-condition'].anotherCondition === 'yes') {
    dataUtils.conditionDataUtils.clearConditionJourneyData(req);
  }
  JourneyContext.putContext(req.session, req.casa.journeyContext)
  req.session.save(next);
};

export default () => ({
  preredirect,
  prerender,
});
