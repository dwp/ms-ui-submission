import logger from '../../../src/lib/logger.js';
import { JourneyContext } from '@dwp/govuk-casa';

const prerender = (req, res, next) => {
  res.locals.cancelForm = true;
  const { employmentEdit } = req.session || false;

  if (employmentEdit) {
    req.casa.journeyContext.setDataForPage('employment-expenses', Object.create(null));
  }

  if (req.casa.journeyContext.data['employment-status'].workTypes.includes('selfEmployed')) {
    res.locals.employerName = req.casa.journeyContext.data['self-employment-details'].employerName;
  } else {
    res.locals.employerName = req.casa.journeyContext.data['employment-details'].employerName;
  }
  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save(next);
};

const postvalidate = (req, res, next) => {
  const appLogger = logger();
  const { employmentEdit, editing } = req.session || false;

  appLogger.info('Navigation rules: employment expenses post validate');
  const { expenses } = req.casa.journeyContext.data['employment-expenses'];
  if (expenses === 'no') {
    req.session.employmentReadyToSave = true;
  }
  if ((editing || employmentEdit) && expenses === 'yes') {
    appLogger.info('Navigation rules: employment expenses edit value has changed');
    return req.session.save((err) => {
      if (err) {
        appLogger.error(err);
        next(err);
      } else {
        res.redirect(302, '/employment-expenses-details');
      }
    });
  }

  req.session.save(next);
};

export default () => ({
  prerender,
  postvalidate,
});
