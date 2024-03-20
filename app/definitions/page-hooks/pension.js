import logger from '../../../src/lib/logger.js';

const prerender = (req, res, next) => {
  // this is added to ensure that the backlink is given the correct
  // value when on a gateway page in a loop
  if (req.session.pensionGather && req.session.pensionGather.length > 0) {
    res.locals.casa.journeyPreviousUrl = '/pension-inherited';
  }
  res.locals.pensionGather = req.session.pensionGather || [];
  next();
};

const postvalidate = (req, res, next) => {
  const appLogger = logger();
  const { editing } = req.session || null;
  const context = req.casa.journeyContext;
  if (editing && context.data.pension && context.data.pension.pension === 'yes') {
    return req.session.save((err) => {
      if (err) {
        appLogger.error(err);
        next(err);
      } else {
        res.redirect(302, '/pension-inherit');
      }
    });
  }
  next();
};

export default () => ({
  prerender,
  postvalidate,
});
