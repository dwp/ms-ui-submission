import dataUtils from '../../../src/lib/data-utils/index.js';
import logger from '../../../src/lib/logger.js';
import { JourneyContext } from '@dwp/govuk-casa';

const appLogger = logger();

export default () => [
  {
    hook: 'prerender',
    middleware: (req, res, next) => {
      const cyaJourney = req.casa.journeyContext.getDataForPage('another-condition') && req.casa.journeyContext.getDataForPage('another-condition').cyaJourney ? req.casa.journeyContext.getDataForPage('another-condition').cyaJourney : null;
      if (cyaJourney === 'yes') {
        req.casa.journeyContext.data['another-health-condition'].anotherCondition = 'no';
        JourneyContext.putContext(req.session, req.casa.journeyContext);
        req.session.save();
      }
      next();
    },
  }, {
    hook: 'preredirect',
    middleware: (req, res, next) => {
      appLogger.info('Navigation rules: conditions');
      const payload = req.casa.journeyContext.data;
      if (req.session.editSection === 'condition') {
        req.casa.journeyContext.setDataForPage('another-health-condition', { anotherCondition: 'no' });
        dataUtils.conditionDataUtils.updateSpecificCondition(payload, req, req.session.editIndex);
      } else {
        const isBack = req.session.conditionBack === true;
        req.session.conditionBack = false;
        dataUtils.conditionDataUtils.addConditionToGather(payload, req, isBack);
      }
      JourneyContext.putContext(req.session, req.casa.journeyContext);
      req.session.save(next);
    },
  }];
