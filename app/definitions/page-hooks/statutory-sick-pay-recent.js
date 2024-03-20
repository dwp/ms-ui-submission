import logger from '../../../src/lib/logger.js';
import { JourneyContext } from '@dwp/govuk-casa';

const prerender = (req, res, next) => {
  const appLogger = logger();
  appLogger.info('Navigation rules: statutory-sick-pay-recent-post-validate pre render');

  const cyaJourney = req.casa.journeyContext.data['claim-start-date-cya'] && req.casa.journeyContext.data['claim-start-date-cya'].cyaJourney ? req.casa.journeyContext.data['claim-start-date-cya'].cyaJourney : false;
  const cyaJourneySp = req.casa.journeyContext.data['statutory-pay-cya'] && req.casa.journeyContext.data['statutory-pay-cya'].cyaJourneySp ? req.casa.journeyContext.data['statutory-pay-cya'].cyaJourneySp : false;
  const cyaJourneyEmployedSsp = req.casa.journeyContext.data['employed-ssp'] && req.casa.journeyContext.data['employed-ssp'].required ? req.casa.journeyContext.data['employed-ssp'].required : false;
  const { claimEnd } = req.casa.journeyContext.data['claim-end-date'] && req.casa.journeyContext.data['claim-end-date'].claimEnd ? req.casa.journeyContext.data['claim-end-date'] : false;

  if (cyaJourney === 'yes' || cyaJourneySp === 'yes') {
    appLogger.info('Navigation rules: statutory-sick-pay-recent pre render CYA edit');
    req.casa.journeyContext.setDataForPage('statutory-sick-pay-end', {});
    req.casa.journeyContext.setDataForPage('claim-start-date-after-statutory-sick-pay', {});
    if (claimEnd === 'yes') req.casa.journeyContext.setDataForPage('claim-end-date', {});
  }

  else if (cyaJourneyEmployedSsp) {
    req.casa.journeyContext.setDataForPage('statutory-sick-pay-recent', {})
    req.casa.journeyContext.setDataForPage('claim-start-date', {});
    req.casa.journeyContext.setDataForPage('late-claim', {});
    req.casa.journeyContext.setDataForPage('statutory-sick-pay-end', {});
    req.casa.journeyContext.setDataForPage('claim-start-date-after-statutory-sick-pay', {});

    if (claimEnd === 'yes') req.casa.journeyContext.setDataForPage('claim-end-date', {});
  }

  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save(next);
};

const preredirect = (req, res, next) => {
  const appLogger = logger();
  appLogger.info('Navigation rules: statutory-sick-pay-recent pre-redirect validate');

  const cyaJourney = req.casa.journeyContext.data['claim-start-date-cya'] && req.casa.journeyContext.data['claim-start-date-cya'].cyaJourney ? req.casa.journeyContext.data['claim-start-date-cya'].cyaJourney : false;
  const cyaJourneySp = req.casa.journeyContext.data['statutory-pay-cya'] && req.casa.journeyContext.data['statutory-pay-cya'].cyaJourneySp ? req.casa.journeyContext.data['statutory-pay-cya'].cyaJourneySp : false;
  const { sspRecent } = req.casa.journeyContext.data['statutory-sick-pay-recent'] || false;
  const { required } = req.casa.journeyContext.data['employed-ssp'] ? req.casa.journeyContext.data['employed-ssp'] : false;

  if (cyaJourney === 'yes' || cyaJourneySp === 'yes') {
    appLogger.info('Navigation rules: statutory-sick-pay-recent pre-redirect CYA edit');
    req.casa.journeyContext.setDataForPage('statutory-sick-pay-end', {});
    req.casa.journeyContext.setDataForPage('claim-start-date-after-statutory-sick-pay', {});
    req.casa.journeyContext.setDataForPage('claim-end-date', {});

    JourneyContext.putContext(req.session, req.casa.journeyContext);
    return req.session.save((err) => {
      if (err) {
        appLogger.error(err);
        next(err);
      } else if (sspRecent === 'no') {
        res.redirect(302, '/claim-start-date');
      } else if (sspRecent === 'yes') {
        res.redirect(302, '/statutory-sick-pay-end');
      }
    });

  }
  else if (required) {
    JourneyContext.putContext(req.session, req.casa.journeyContext);
    return req.session.save((err) => {
      if (err) {
        appLogger.error(err);
        next(err);
      } else {
        res.redirect(302, '/claim-start-date');
      }
    });
  }

  JourneyContext.putContext(req.session, req.casa.journeyContext)
  req.session.save(next);
};

export default () => ({
  prerender,
  preredirect,
});
