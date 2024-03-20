import { DateTime } from 'luxon';
import { JourneyContext } from '@dwp/govuk-casa';
import logger from '../../../src/lib/logger.js';

const prerender = (req, res, next) => {
  const { cyaJourney } = req.casa.journeyContext.data['claim-start-date-cya'] ? req.casa.journeyContext.data['claim-start-date-cya'] : false;
  const cyaJourneySp = req.casa.journeyContext.data['statutory-pay-cya'] && req.casa.journeyContext.data['statutory-pay-cya'].cyaJourney ? req.casa.journeyContext.data['statutory-pay-cya'].cyaJourney : false;

  if (cyaJourney === 'yes' || cyaJourneySp === 'yes') {
    req.casa.journeyContext.setDataForPage('claim-start-date-after-statutory-sick-pay', Object.create(null));
  }

  res.locals.sspEndDateHint = DateTime.now()
    .minus({ months: 3 })
    .toFormat('d M yyyy');

  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save(next);
};

const preredirect = (req, res, next) => {
  const appLogger = logger();

  const { cyaJourney } = req.casa.journeyContext.data['claim-start-date-cya'] ? req.casa.journeyContext.data['claim-start-date-cya'] : false;
  const cyaJourneySp = req.casa.journeyContext.data['statutory-pay-cya'] && req.casa.journeyContext.data['statutory-pay-cya'].cyaJourney ? req.casa.journeyContext.data['statutory-pay-cya'].cyaJourney : false;
  const pageData = req.casa.journeyContext.data['statutory-sick-pay-end'] ? req.casa.journeyContext.data['statutory-sick-pay-end'] : false;
  const cyaJourneyEmployedSsp = req.casa.journeyContext.data['employed-ssp'] && req.casa.journeyContext.data['employed-ssp'].required ? req.casa.journeyContext.data['employed-ssp'].required : false;

  if ((cyaJourney === 'yes' || cyaJourneySp === 'yes' || cyaJourneyEmployedSsp) && pageData) {
    return req.session.save((err) => {
      if (err) {
        appLogger.error(err);
        next(err);
      } else {
        res.redirect(302, '/claim-start-date-after-statutory-sick-pay');
      }
    });
  }
  next();
};

export default () => ({
  prerender,
  preredirect,
});
