import { JourneyContext } from '@dwp/govuk-casa';

const prerender = (req, res, next) => {
  const { hours } = req.casa.journeyContext.data['employment-hours'];
  const { employmentEdit } = req.session || false;

  if (employmentEdit) {
    req.casa.journeyContext.setDataForPage('employment-pay-frequency-samehours', Object.create(null));
  }

  res.locals.sameHours = hours && hours !== '0';
  if (req.casa.journeyContext.data['employment-status'].workTypes.includes('selfEmployed')) {
    res.locals.employerName = req.casa.journeyContext.data['self-employment-details'].employerName;
  } else {
    res.locals.employerName = req.casa.journeyContext.data['employment-details'].employerName;
  }
  res.locals.cancelForm = true;
  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save(next);
};

export default () => ({
  prerender,
});
