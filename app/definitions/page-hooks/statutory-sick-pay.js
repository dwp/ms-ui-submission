import logger from '../../../src/lib/logger.js';
import { JourneyContext } from '@dwp/govuk-casa';

const prerender = (req, res, next) => {
  const appLogger = logger();

  appLogger.info('Navigation rules: SSP pre render');

  const { cyaJourney } = req.casa.journeyContext.data['statutory-pay-cya'] ? req.casa.journeyContext.data['statutory-pay-cya'] : false;

  if (cyaJourney === 'yes') {
    appLogger.info('Navigation rules: SSP pre render CYA edit');
    const { statutoryPay } = req.casa.journeyContext.data['statutory-pay'];

    if (statutoryPay) {

      req.casa.journeyContext.setDataForPage('statutory-sick-pay-end', {});
      req.casa.journeyContext.setDataForPage('statutory-sick-pay-recent', {});
      req.casa.journeyContext.setDataForPage('claim-start-date', {});
      req.casa.journeyContext.setDataForPage('claim-start-date-after-statutory-sick-pay', {});
      req.casa.journeyContext.setDataForPage('claim-start-date', {});
      req.casa.journeyContext.setDataForPage('claim-end-date', {});

    }
  }

  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save(next);
};

const postvalidate = (req, res, next) => {
  const appLogger = logger();

  appLogger.info('Navigation rules: SSP post validate');

  const { cyaJourney } = req.casa.journeyContext.data['statutory-pay-cya'] ? req.casa.journeyContext.data['statutory-pay-cya'] : false;

  if (cyaJourney === 'yes') {
    appLogger.info('Navigation rules: SSP post validate CYA edit');
    const { statutoryPay } = req.casa.journeyContext.data['statutory-pay'];

    if (statutoryPay) {
      return req.session.save((err) => {
        if (err) {
          appLogger.error(err);
          next(err);
        } else if (statutoryPay === 'no') {
          res.redirect(302, '/statutory-sick-pay-recent');
        } else if (statutoryPay === 'yes') {
          res.redirect(302, '/statutory-sick-pay-end');
        }
      });
    }
  }

  req.session.save(next);
};

export default () => ({
  prerender,
  postvalidate,
});
