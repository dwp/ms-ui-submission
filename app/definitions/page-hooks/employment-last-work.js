import { DateTime } from 'luxon';
import { JourneyContext } from '@dwp/govuk-casa';

const prerender = (req, res, next) => {
  res.locals.lastWorkedDateHint = DateTime.now()
    .minus({ weeks: 2 })
    .toFormat('d M yyyy');

  res.locals.cancelForm = true;
  const { employmentEdit } = req.session || false;

  if (employmentEdit) {
    req.casa.journeyContext.setDataForPage('employment-last-work', Object.create(null));
  }

  if (req.casa.journeyContext.data['employment-status'].workTypes.includes('selfEmployed')) {
    res.locals.employerName = req.casa.journeyContext.data['self-employment-details'].employerName;
  }
  else {
    res.locals.employerName = req.casa.journeyContext.data['employment-details'].employerName;
  }

  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save(next);
};

export default () => ({
  prerender,
});
