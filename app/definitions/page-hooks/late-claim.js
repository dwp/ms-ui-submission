import logger from '../../../src/lib/logger.js';

const prerender = (req, res, next) => {
  res.locals.claimStartDate = req.casa.journeyContext.data['claim-start-date'].claimStartDate;
  next();
};

const preredirect = (req, res, next) => {
  const appLogger = logger();
  const { cyaJourney } = req.casa.journeyContext.data['claim-start-date-cya'] ? req.casa.journeyContext.data['claim-start-date-cya'] : false;
  const { claimEnd } = req.casa.journeyContext.data['claim-end-date'] && req.casa.journeyContext.data['claim-end-date'].claimEnd ? req.casa.journeyContext.data['claim-end-date'] : false;
  const { lateClaim } = req.casa.journeyContext.data['late-claim'] && req.casa.journeyContext.data['late-claim'].lateClaim ? req.casa.journeyContext.data['late-claim'] : false;
  const cyaJourneyEmployedSsp = req.casa.journeyContext.data['employed-ssp'] && req.casa.journeyContext.data['employed-ssp'].required ? req.casa.journeyContext.data['employed-ssp'].required : false;

  if ((cyaJourney === 'yes' && claimEnd && lateClaim) || cyaJourneyEmployedSsp) {
    if (claimEnd === 'no' && lateClaim === 'yes') {
      return req.session.save((err) => {
        if (err) {
          appLogger.error(err);
          next(err);
        } else {
          res.redirect(302, '/check-your-answers');
        }
      });
    }
    else if (claimEnd === 'yes' && lateClaim === 'yes') {
      return req.session.save((err) => {
        if (err) {
          appLogger.error(err);
          next(err);
        } else {
          res.redirect(302, '/claim-end-date');
        }
      });
    }
    else if (lateClaim === 'no') {
      return req.session.save((err) => {
        if (err) {
          appLogger.error(err);
          next(err);
        } else {
          res.redirect(302, '/claim-start-date');
        }
      });
    }
  }

  next();
}

export default () => ({
  prerender,
  preredirect,
});
