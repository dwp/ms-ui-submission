import logger from '../../../src/lib/logger.js';

export default () => [
  {
    hook: 'prerender',
    middleware: (req, res, next) => {
      const { editing } = req.session || null;
      const edit = req.query.edit !== undefined;
      const cyaEdit = req.session.cyaEdit === edit;
      const editMode = edit && cyaEdit;
      const appLogger = logger();

      if (!editMode && editing) {
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
