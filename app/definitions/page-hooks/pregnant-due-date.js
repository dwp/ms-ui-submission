import { DateTime } from 'luxon';
import logger from '../../../src/lib/logger.js';

const prerender = (req, res, next) => {
  res.locals.dueDateHint = DateTime.now()
    .plus({ months: 5 })
    .toFormat('d M yyyy');
  next();
};

const preredirect = (req, res, next) => {
  const appLogger = logger();

  if (req.session.editing) {
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
