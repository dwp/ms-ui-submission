import { DateTime } from 'luxon';
import logger from '../../../src/lib/logger.js';

export default () => [{
  hook: 'prerender',
  middleware: (req, res, next) => {
    res.locals.admissionDateHint = DateTime.now()
      .minus({ months: 2 })
      .toFormat('d M yyyy');
    next();
  },
},
{
  hook: 'preredirect',
  middleware: (req, res, next) => {
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
  },
},
];
