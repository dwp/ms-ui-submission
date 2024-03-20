import logger from '../../../src/lib/logger.js';

const postvalidate = (req, res, next) => {
  const appLogger = logger();

  appLogger.info('Navigation rules: reason-no-sick-pay post validate');

  const { cyaJourney } = req.casa.journeyContext.data['statutory-pay-cya'] ? req.casa.journeyContext.data['statutory-pay-cya'] : false;

  if (cyaJourney === 'yes') {
    appLogger.info('Navigation rules: reason-no-sick-pay post validate CYA edit');

    return req.session.save((err) => {
      if (err) {
        appLogger.error(err);
        next(err);
      } else {
        res.redirect(302, '/statutory-sick-pay-recent');
      }
    });

  }

  req.session.save(next);
};

export default () => ({
  postvalidate,
});
