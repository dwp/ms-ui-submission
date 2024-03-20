import { DateTime } from 'luxon';
import { JourneyContext } from '@dwp/govuk-casa';
import logger from '../../../src/lib/logger.js';

const prerender = (req, res, next) => {
  res.locals.claimStartDateHint = DateTime.now()
    .toFormat('d M yyyy');
  res.locals.hiddenSspEndDate = (typeof req.casa.journeyContext.data['statutory-sick-pay-end'] !== 'undefined'
    && typeof req.casa.journeyContext.data['statutory-sick-pay-end'].sspEndDate !== 'undefined')
    ? JSON.stringify(req.casa.journeyContext.data['statutory-sick-pay-end'].sspEndDate) : 'not-entered';
  if (req.casa.journeyContext.data['employment-details']) {
    res.locals.employerName = req.casa.journeyContext.data['employment-details'].employerName;
  } else if (req.casa.journeyContext.data['self-employment-details']) {
    res.locals.employerName = req.casa.journeyContext.data['self-employment-details'].employerName;
  }

  const { cyaJourney } = req.casa.journeyContext.data['claim-start-date-cya'] && req.casa.journeyContext.data['claim-start-date-cya'].cyaJourney ? req.casa.journeyContext.data['claim-start-date-cya'] : false;
  const { editClaimStart } = req.casa.journeyContext.data['claim-start-date-cya'] && req.casa.journeyContext.data['claim-start-date-cya'].editClaimStart ? req.casa.journeyContext.data['claim-start-date-cya'] : false;
  const cyaJourneySp = req.casa.journeyContext.data['statutory-pay-cya'] && req.casa.journeyContext.data['statutory-pay-cya'].cyaJourney ? req.casa.journeyContext.data['statutory-pay-cya'].cyaJourney : false;
  const { lateClaim } = req.casa.journeyContext.data['late-claim'] && req.casa.journeyContext.data['late-claim'].lateClaim ? req.casa.journeyContext.data['late-claim'] : 'yes';

  if ((cyaJourney === 'yes' || cyaJourneySp === 'yes') && !editClaimStart || lateClaim === 'no') {
    req.casa.journeyContext.setDataForPage('claim-start-date', Object.create(null));
    req.casa.journeyContext.setDataForPage('late-claim', Object.create(null));
  }
  else if (editClaimStart) {
    req.casa.journeyContext.setDataForPage('late-claim', Object.create(null));
  }

  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save(next);
};

const preredirect = (req, res, next) => {
  const appLogger = logger();
  const claimStartDate = req.casa.journeyContext.data['claim-start-date'] && req.casa.journeyContext.data['claim-start-date'].claimStartDate ? req.casa.journeyContext.data['claim-start-date'].claimStartDate : false;
  const claimEnd = req.casa.journeyContext.data['claim-end-date'] && req.casa.journeyContext.data['claim-end-date'].claimEnd ? req.casa.journeyContext.data['claim-end-date'].claimEnd : false;
  const cyaJourney = req.casa.journeyContext.data['claim-start-date-cya'] && req.casa.journeyContext.data['claim-start-date-cya'].cyaJourney ? req.casa.journeyContext.data['claim-start-date-cya'].cyaJourney : false;
  const { required } = req.casa.journeyContext.data['employed-ssp'] ? req.casa.journeyContext.data['employed-ssp'] : false;

  if ((claimStartDate && claimEnd && cyaJourney === 'yes') || required) {
    const { dd, mm, yyyy } = claimStartDate;
    const today = DateTime.now().startOf('day');
    const threeMonthsPast = today.minus({ months: 3 });
    const currentClaimStartDate = DateTime.fromISO(`${yyyy}-${('0' + mm).slice(-2)}-${('0' + dd).slice(-2)}`).endOf('day');

    if (currentClaimStartDate.isValid && (threeMonthsPast.ts < currentClaimStartDate.ts)) {
      console.log('claim-start-date LESS than 3 months in the past');
      return req.session.save((err) => {
        if (err) {
          appLogger.error(err);
          next(err);
        } else if (claimEnd === 'no' && required) {
          res.redirect(302, '/check-your-answers');
        } else {
          res.redirect(302, '/claim-end-date');
        }
      });
    }
    else if (threeMonthsPast.ts > currentClaimStartDate.ts && !(currentClaimStartDate.ts > today)) {
      console.log('claim-start-date MORE than 3 months in the past');
      return req.session.save((err) => {
        if (err) {
          appLogger.error(err);
          next(err);
        } else {
          res.redirect(302, '/late-claim');
        }
      });
    }
  }
  next();
};

export default () => ({
  prerender,
  preredirect,
});