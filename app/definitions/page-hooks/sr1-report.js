import logger from '../../../src/lib/logger.js';

export default () => [
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
  }];
