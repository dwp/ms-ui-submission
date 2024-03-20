import { JourneyContext } from '@dwp/govuk-casa';
import logger from '../../../src/lib/logger.js';

const prerender = (req, res, next) => {
  res.locals.cancelForm = true;
  const { employmentEdit } = req.session || false;

  if (employmentEdit) {
    req.casa.journeyContext.setDataForPage('employment-details', Object.create(null));
    JourneyContext.putContext(req.session, req.casa.journeyContext);
    req.session.save(next);
  } else {
    next();
  }  
};

const prevalidate = (req, res, next) => {
  const employmentDetails = req.casa.journeyContext.data['employment-details'];
  const { employerAddress } = employmentDetails;
  employerAddress.address1 = employerAddress.address1.trim();
  employerAddress.address2 = employerAddress.address2.trim();
  employerAddress.address3 = employerAddress.address3.trim();
  employerAddress.postcode = employerAddress.postcode.replaceAll(' ', '');
  next();
};

const preredirect = (req, res, next) => {
  const appLogger = logger();

  const { cyaJourney } = req.casa.journeyContext.data['employment-details-cya'] && req.casa.journeyContext.data['employment-details-cya'].cyaJourney ? req.casa.journeyContext.data['employment-details-cya'] : false;
  const employedOption = req.casa.journeyContext.data.employed || null;

  if (cyaJourney === 'yes') {
    const employmentNumber = req.session.employmentGather && req.session.employmentGather.length ? req.session.employmentGather.length : 0;
    const employedAnswer = employmentNumber > 0 ? employedOption.other : employedOption.employed;
    const screen = employmentNumber > 0 ? 'employed-other' : 'employed';

    req.casa.journeyContext.setDataForPage('employed', {
      employed: employedAnswer,
      other: employedAnswer,
      screen,
    });
    JourneyContext.putContext(req.session, req.casa.journeyContext);
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
  prevalidate,
  preredirect
});
