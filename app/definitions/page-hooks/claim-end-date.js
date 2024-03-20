import { DateTime } from 'luxon';
import { JourneyContext } from '@dwp/govuk-casa';
import logger from '../../../src/lib/logger.js';

const prerender = (req, res, next) => {

  res.locals.claimEndDateHint = DateTime.now().plus({ months: 2 }).toFormat('d M yyyy');

  const { claimEnd } = req.casa.journeyContext.data['claim-end-date'] && req.casa.journeyContext.data['claim-end-date'].claimEnd ? req.casa.journeyContext.data['claim-end-date'] : false;
  const { editClaimStart } = req.casa.journeyContext.data['claim-start-date-cya'] && req.casa.journeyContext.data['claim-start-date-cya'].editClaimStart ? req.casa.journeyContext.data['claim-start-date-cya'] : false;
  const sspClaimStart = req.casa.journeyContext.data['claim-start-date-after-statutory-sick-pay'];
  const cyaJourneyEmployedSsp = req.casa.journeyContext.data['employed-ssp'] && req.casa.journeyContext.data['employed-ssp'].required ? req.casa.journeyContext.data['employed-ssp'].required : false;

  if (editClaimStart && claimEnd === 'no' && !cyaJourneyEmployedSsp) {
    req.casa.journeyContext.setDataForPage('claim-end-date', {});
  }

  if (typeof sspClaimStart !== 'undefined' && sspClaimStart.claimStartDateAfterSsp === 'yes') {
    const { sspEndDate } = req.casa.journeyContext.data['statutory-sick-pay-end'];
    const { dd, mm, yyyy } = sspEndDate;
    const dayAfterSspEndDate = DateTime.fromISO(`${yyyy}-${('0' + mm).slice(-2)}-${('0' + dd).slice(-2)}`);

    res.locals.hiddenClaimStartDate = `{"dd":"${dayAfterSspEndDate.day}","mm":"${dayAfterSspEndDate.month}","yyyy":"${dayAfterSspEndDate.year}"}`;
  } else {
    res.locals.hiddenClaimStartDate = JSON.stringify(req.casa.journeyContext.data['claim-start-date'].claimStartDate);
  }

  const { cyaJourney } = req.casa.journeyContext.data['claim-start-date-cya'] ? req.casa.journeyContext.data['claim-start-date-cya'] : false;
  const cyaJourneySp = req.casa.journeyContext.data['statutory-pay-cya'] && req.casa.journeyContext.data['statutory-pay-cya'].cyaJourney ? req.casa.journeyContext.data['statutory-pay-cya'].cyaJourney : false;

  if (cyaJourney === 'yes' || cyaJourneySp === 'yes') {
    req.casa.journeyContext.setDataForPage('claim-end-date', {});
  }
  else if (cyaJourneyEmployedSsp && claimEnd === 'yes') {
    req.casa.journeyContext.setDataForPage('claim-end-date', {});
  }
  JourneyContext.putContext(req.session, req.casa.journeyContext)
  req.session.save(next);
};

const preredirect = (req, res, next) => {
  const appLogger = logger();

  const { cyaJourney } = req.casa.journeyContext.data['claim-start-date-cya'] ? req.casa.journeyContext.data['claim-start-date-cya'] : false;
  const cyaJourneySp = req.casa.journeyContext.data['statutory-pay-cya'] && req.casa.journeyContext.data['statutory-pay-cya'].cyaJourney ? req.casa.journeyContext.data['statutory-pay-cya'].cyaJourney : false;
  const cyaJourneyClaimAfterSSP = req.casa.journeyContext.data['claim-start-date-after-ssp-cya'] && req.casa.journeyContext.data['claim-start-date-after-ssp-cya'].cyaJourney ? req.casa.journeyContext.data['claim-start-date-after-ssp-cya'].cyaJourney : false;
  const pageData = req.casa.journeyContext.data['claim-end-date'] ? req.casa.journeyContext.data['claim-end-date'] : false;
  const cyaJourneyEmployedSsp = req.casa.journeyContext.data['employed-ssp'] && req.casa.journeyContext.data['employed-ssp'].required ? req.casa.journeyContext.data['employed-ssp'].required : false;

  if ((cyaJourney === 'yes' || cyaJourneySp === 'yes' || cyaJourneyClaimAfterSSP === 'yes' || cyaJourneyEmployedSsp) && pageData) {
    return req.session.save((err) => {
      if (err) {
        appLogger.error(err);
        next(err);
      } else {
        res.redirect(302, '/check-your-answers');
      }
    });
  }
  next();
};

export default () => ({
  prerender,
  preredirect,
});
