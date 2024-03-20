import { JourneyContext } from '@dwp/govuk-casa';

const prerender = (req, res, next) => {
  if (req.casa.journeyContext.data['eligibility-start'] !== undefined) {
    req.casa.journeyContext.data['eligibility-start'] = { visited: false };
  }
  if (req.casa.journeyContext.data['help-someone-apply'] !== undefined) {
    req.casa.journeyContext.data['help-someone-apply'] = { visited: false };
  }
  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save(next);
};

export default () => ({
  prerender,
});
