import { JourneyContext } from '@dwp/govuk-casa';

const prerender = (req, res, next) => {
  res.locals.cancelForm = true;
  const { employmentEdit } = req.session || false;

  if (employmentEdit) {
    req.casa.journeyContext.setDataForPage('employment-expenses-details', Object.create(null));
    JourneyContext.putContext(req.session, req.casa.journeyContext);
    req.session.save(next);
  } else {
    next();
  }
};

export default () => ({
  prerender,
});
