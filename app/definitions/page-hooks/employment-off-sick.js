import logger from '../../../src/lib/logger.js';
import { JourneyContext } from '@dwp/govuk-casa';

const prerender = (req, res, next) => {

  const offSick = req.casa.journeyContext.data['employment-off-sick'] ? req.casa.journeyContext.data['employment-off-sick'].offSick : null;
  req.session.savedOffsick = offSick;

  res.locals.cancelForm = true;
  const { employmentEdit } = req.session || false;

  if (employmentEdit) {
    req.casa.journeyContext.setDataForPage('employment-off-sick', Object.create(null));
  }


  if (req.casa.journeyContext.data['employment-status'].workTypes.includes('selfEmployed')) {
    res.locals.employerName = req.casa.journeyContext.data['self-employment-details'].employerName;
  }
  else {
    res.locals.employerName = req.casa.journeyContext.data['employment-details'].employerName;
  }

  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save(next);
};

const postvalidate = (req, res, next) => {
  const appLogger = logger();

  const { offSick } = req.casa.journeyContext.data['employment-off-sick'] || null;
  const { savedOffsick, editing } = req.session || null;

  appLogger.info('Navigation rules: employment off sick post validate');

  if (editing && !(savedOffsick === offSick)) {
    appLogger.info('Navigation rules: employment off sick edit value has changed');
    req.session.employmentEdit = true;
    req.session.employedSaved = false;
    return req.session.save((err) => {
      if (err) {
        appLogger.error(err);
        next(err);
      } else if (offSick === 'yes') {
        res.redirect(302, '/employment-last-work');
      }
      else {
        res.redirect(302, '/employment-hours');
      }
    });
  }

  req.session.save(next);
};

export default () => ({
  prerender,
  postvalidate,
});
