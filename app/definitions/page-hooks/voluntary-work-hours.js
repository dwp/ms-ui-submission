import dataUtils from '../../../src/lib/data-utils/index.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
const prerender = (req, res, next) => {
  res.locals.organisationName = req.casa.journeyContext.data['voluntary-work-details'].organisationName;
  res.locals.cancelForm = true;
  next();
};

const preredirect = (req, res, next) => {
  appLogger.info('Navigation rules: voluntary-work-hours');
  if (!req.session.editSection || req.session.editSection === null || !req.session.editSection === 'voluntary') {
    dataUtils.voluntaryDataUtils.addVoluntaryToGather(req);
  }
  next();
};

export default () => ({
  prerender,
  preredirect,
});
