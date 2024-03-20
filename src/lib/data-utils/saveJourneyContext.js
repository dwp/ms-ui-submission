import { JourneyContext } from '@dwp/govuk-casa';
import logger from '../logger.js';

const appLogger = logger();

export default function saveJourneyContext(req, res, next, page) {
  try {
    JourneyContext.putContext(req.session, req.casa.journeyContext);
    req.session.save((error) => {
      if(error) {
        appLogger.warn(error);
        next(error);
      }
      else if(page) {
        appLogger.info(`Redirect to relevant page for edit ${page}`);
        return req.session.save(() => {res.redirect(302, `/${page}?edit`)});
      }
    });
  } catch (error) {
    appLogger.warn(error);
    next(error);
  }
}