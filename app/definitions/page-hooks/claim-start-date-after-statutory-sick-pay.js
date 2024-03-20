import logger from '../../../src/lib/logger.js';
import { JourneyContext } from '@dwp/govuk-casa';

const prerender = (req, res, next) => {
  const appLogger = logger();

  appLogger.info('Navigation rules: claim-start-date-after-statutory-sick-pay pre render');

  const { sspEndDate } = req.casa.journeyContext.data['statutory-sick-pay-end'];
  res.locals.sspEndDate = sspEndDate;


  const cyaJourneyEmployedSsp = req.casa.journeyContext.data['employed-ssp'] && req.casa.journeyContext.data['employed-ssp'].required ? req.casa.journeyContext.data['employed-ssp'].required : false;

  if (cyaJourneyEmployedSsp) req.casa.journeyContext.setDataForPage('claim-start-date-after-statutory-sick-pay', {});

  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save(next);
};


const postvalidate = (req, res, next) => {
  const appLogger = logger();

  const { cyaJourney } = req.casa.journeyContext.data['claim-start-date-cya'] ? req.casa.journeyContext.data['claim-start-date-cya'] : false;
  const cyaJourneySp = req.casa.journeyContext.data['statutory-pay-cya'] && req.casa.journeyContext.data['statutory-pay-cya'].cyaJourney ? req.casa.journeyContext.data['statutory-pay-cya'].cyaJourney : false;
  const { claimStartDateAfterSsp } = req.casa.journeyContext.data['claim-start-date-after-statutory-sick-pay'] ? req.casa.journeyContext.data['claim-start-date-after-statutory-sick-pay'] : false;


  const cyaJourneyClaimAfterSSP = req.casa.journeyContext.data['claim-start-date-after-ssp-cya'] && req.casa.journeyContext.data['claim-start-date-after-ssp-cya'].cyaJourney ? req.casa.journeyContext.data['claim-start-date-after-ssp-cya'].cyaJourney : false;

  if (cyaJourneyClaimAfterSSP === 'yes') {
    appLogger.info('Navigation rules: claim-start-date-after-statutory-sick-pay pre-redirect CYA edit');

    req.casa.journeyContext.setDataForPage('claim-start-date', {});
    req.casa.journeyContext.setDataForPage('claim-end-date', {});
  }

  if (cyaJourney === 'yes' || cyaJourneySp === 'yes') {
    return req.session.save((err) => {
      if (err) {
        appLogger.error(err);
        next(err);
      } else if (claimStartDateAfterSsp === 'no') {
        res.redirect(302, '/claim-start-date');
      } else if (claimStartDateAfterSsp === 'yes') {
        res.redirect(302, '/claim-end-date');
      } else {
        next();
      }
    });
  }
  next();
};

export default () => ({
  prerender,
  postvalidate,
});