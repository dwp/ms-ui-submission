import { JourneyContext } from '@dwp/govuk-casa';

const prerender = (req, res, next) => {
  res.locals.cancelForm = true;
  const { employmentEdit } = req.session || false;

  if (employmentEdit) {
    req.casa.journeyContext.setDataForPage('employment-hours', { undefined });
  }

  if (req.casa.journeyContext.data['employment-status'].workTypes.includes('selfEmployed')) {
    res.locals.employerName = req.casa.journeyContext.data['self-employment-details'].employerName;
  } else {
    res.locals.employerName = req.casa.journeyContext.data['employment-details'].employerName;
  }

  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save(next);
};

export default () => ({
  prerender,
});
