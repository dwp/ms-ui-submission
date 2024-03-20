import logger from '../../../src/lib/logger.js';

export default () => [
  {
    hook: 'postvalidate',
    middleware: (req, res, next) => {
      const { editing } = req.session || null;
      const appLogger = logger();
      if (editing) {
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
