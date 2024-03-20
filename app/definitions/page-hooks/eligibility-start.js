import { JourneyContext } from '@dwp/govuk-casa';

const prerender = (req, res, next) => {
  req.casa.journeyContext.data['eligibility-start'] = { visited: true };
  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save(next);
};

export default () => ({
  prerender,
});
