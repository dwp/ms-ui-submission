import logger from '../../../src/lib/logger.js';

const postvalidate = (req, res, next) => {
  const appLogger = logger();
  const { editPage, editing } = req.session || false;

  appLogger.info('Navigation rules: employment last page post validate');
  req.session.employmentReadyToSave = true;
  if (editing && editPage === 'employment-expenses') {
    return req.session.save((err) => {
      if (err) {
        appLogger.error(err);
        next(err);
      } else {
        res.redirect(302, '/check-your-answers');
      }
    });
  }

  req.session.save(next);
};

export default () => ({
  postvalidate,
});
