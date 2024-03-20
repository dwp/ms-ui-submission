import logger from '../../../src/lib/logger.js';
import { JourneyContext } from '@dwp/govuk-casa';

const prerender = (req, res, next) => {
  const appLogger = logger();

  res.locals.cancelForm = true;
  req.session.employedSaved = false;

  appLogger.info('Navigation rules: employment status');

  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save(next);
};

const postvalidate = (req, res, next) => {
  const appLogger = logger();

  appLogger.info('Navigation rules: employment status post validate');
  const { editing } = req.session;

  if (editing) {
    const savedWorkTypes = req.session.employmentWorkTypes || null;
    const { workTypes } = req.casa.journeyContext.data['employment-status'] || null;
    const isSelfEmployed = savedWorkTypes && workTypes ? workTypes.includes('selfEmployed') === savedWorkTypes.includes('selfEmployed') : null;

    if (JSON.stringify(savedWorkTypes) !== JSON.stringify(workTypes)) {

      if (workTypes && !isSelfEmployed) {
        appLogger.info('Navigation rules: employment status edit value has changed');
        req.session.employmentEdit = true;
        return req.session.save((err) => {
          if (err) {
            appLogger.error(err);
            next(err);
          } else if (workTypes.includes('selfEmployed')) {
            res.redirect(302, '/self-employment-details');
          }
          else {
            res.redirect(302, '/employment-details');
          }
        });
      }
    }
  }

  req.session.save(next);
};

export default () => ({
  prerender,
  postvalidate,
});
