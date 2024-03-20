import dataUtils from '../../../src/lib/data-utils/index.js';
import logger from '../../../src/lib/logger.js';
import {
  JourneyContext
} from '@dwp/govuk-casa';

const prerender = (req, res, next) => {
  // this is added to ensure that the backlink is given the correct
  // value when on a gateway page in a loop
  const appLogger = logger();
  const payload = req.casa.journeyContext.data;
  const {
    employed
  } = payload || null;
  const previousPage = req.headers.referer?.split('/').pop() === 'employment-status';
  const {
    editing,
    editSection,
    editIndex,
    employmentReadyToSave,
  } = req.session;
  if (editing && editSection === 'voluntary') {
    return req.session.save((err) => {
      if (err) {
        appLogger.error(err);
        next(err);
      } else {
        res.redirect(302, '/check-your-answers');
      }
    });
  }

  const employmentOffSickCya = req.casa.journeyContext.data['employment-pages-cya'] && req.casa.journeyContext.data['employment-pages-cya'].cyaJourney ? req.casa.journeyContext.data['employment-pages-cya'].cyaJourney : false;

  if ((employed?.employed === 'yes' || employed?.other === 'yes') && !req.session.employedSaved && !previousPage && editSection !== 'employment' && employmentReadyToSave === true) {
    if (!req.session.employmentGather || req.session.employmentGather.length === 0) {
      req.casa.journeyContext.setDataForPage('employed-ssp', {
        required: true
      });
    }
    appLogger.info('addEmploymentToGather');
    dataUtils.employmentDataUtils.addEmploymentToGather(payload, req);
    req.session.employmentReadyToSave = false;
  } else if (editSection === 'employment' && editIndex && !req.session.employedSaved) {
    dataUtils.employmentDataUtils.updateSpecificEmployment(
      req.casa.journeyContext.data,
      req,
    );
    req.session.employmentEdit = false;
    req.session.employedSaved = true;
  }

  req.session.employmentEdit = false;
  req.session.employedSaved = true;

  if (req.session.employmentGather && req.session.employmentGather.length > 0) {
    const lastEntry = req.session.employmentGather[req.session.employmentGather.length - 1];

    if (lastEntry.offSick === 'yes') {
      res.locals.casa.journeyPreviousUrl = '/employment-last-work';
    } else if (lastEntry.expensesDetails) {
      res.locals.casa.journeyPreviousUrl = '/employment-expenses-details';
    } else if (lastEntry.expenses === 'no') {
      res.locals.casa.journeyPreviousUrl = '/employment-expenses';
    }
  }
  res.locals.employmentGather = req.session.employmentGather || [];

  if (employmentOffSickCya === 'yes') {
    return req.session.save((err) => {
      if (err) {
        appLogger.error(err);
        next(err);
      } else {
        res.redirect(302, '/check-your-answers');
      }
    });
  }
  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save(next);
};

const preredirect = (req, res, next) => {
  const appLogger = logger();
  appLogger.info('Navigation rules: employed preredirect');

  const employed = req.casa.journeyContext.data.employed && req.casa.journeyContext.data.employed.employed ? req.casa.journeyContext.data.employed.employed : null;
  const employedOther = req.casa.journeyContext.data.employed && req.casa.journeyContext.data.employed.other ? req.casa.journeyContext.data.employed.other : null;
  const {
    statutoryPay
  } = req.casa.journeyContext.data['statutory-pay'] && req.casa.journeyContext.data['statutory-pay'].statutoryPay ? req.casa.journeyContext.data['statutory-pay'] : false;
  const {
    statutoryPayEndDate
  } = req.casa.journeyContext.data['statutory-pay-end-date'] && req.casa.journeyContext.data['statutory-pay-end-date'].statutoryPayEndDate ? req.casa.journeyContext.data['statutory-pay-end-date'] : false;

  const cyaJourney = req.casa.journeyContext.data['employed-cya'] && req.casa.journeyContext.data['employed-cya'].cyaJourney ? req.casa.journeyContext.data['employed-cya'].cyaJourney : null;
  const cyaJourneyEmployedSsp = req.casa.journeyContext.data['employed-ssp'] && req.casa.journeyContext.data['employed-ssp'].required ? req.casa.journeyContext.data['employed-ssp'].required : false;

  const employedOption = req.casa.journeyContext.data.employed || null;

  if (employedOption) {
    const employmentNumber = req.session.employmentGather && req.session.employmentGather.length ? req.session.employmentGather.length : 0;
    const employedAnswer = employmentNumber > 0 ? employedOption.other : employedOption.employed;
    const screen = employmentNumber > 0 ? 'employed-other' : 'employed';

    req.casa.journeyContext.setDataForPage('employed', {
      employed: employedAnswer,
      other: employedAnswer,
      screen,
    });
  }

  if (cyaJourney && cyaJourney === 'yes' && (employed === 'yes' || employedOther === 'yes')) {
    req.session.employedSaved = false;
    req.session.editing = false;
    req.casa.journeyContext.setDataForPage('employed', {
      other: 'yes',
      employed: 'yes',
      screen: employedOption.screen
    });
    JourneyContext.putContext(req.session, req.casa.journeyContext);
    return req.session.save((err) => {
      if (err) {
        appLogger.error(err);
        next(err);
      } else {
        res.redirect(302, '/check-your-answers');
      }
    });
  }
  if (cyaJourney && cyaJourney === 'yes' && (employed === 'no' || employedOther === 'no') && cyaJourneyEmployedSsp && statutoryPay !== 'yes') {
    appLogger.info('Redirecting to statutory-sick-pay-recent');
    req.casa.journeyContext.setDataForPage('employed', {
      other: 'no',
      employed: 'no',
      screen: employedOption.screen
    });
    JourneyContext.putContext(req.session, req.casa.journeyContext);
    return req.session.save((err) => {
      if (err) {
        appLogger.error(err);
        next(err);
      } else {
        res.redirect(302, '/statutory-sick-pay-recent');
      }
    });
  }
  if (
    (cyaJourney && cyaJourney === 'yes' && (employed === 'no' || employedOther === 'no') && cyaJourneyEmployedSsp && statutoryPay === 'yes' && statutoryPayEndDate === 'yes') ||
    (cyaJourney && cyaJourney === 'yes' && (employed === 'no' || employedOther === 'no'))
  ) {
    req.casa.journeyContext.setDataForPage('employed', {
      other: 'no',
      employed: 'no',
      screen: employedOption.screen
    });
    JourneyContext.putContext(req.session, req.casa.journeyContext);
    return req.session.save((err) => {
      if (err) {
        appLogger.error(err);
        next(err);
      } else {
        res.redirect(302, '/check-your-answers');
      }
    });
  }

  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save(next);
};

export default () => ({
  prerender,
  preredirect,
});