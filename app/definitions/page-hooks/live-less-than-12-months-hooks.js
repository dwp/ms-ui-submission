import { JourneyContext } from '@dwp/govuk-casa';

export default () => [
  {
    hook: 'preredirect',
    middleware: (req, res, next) => {
      if (req.casa.editMode && req.casa.journeyContext.data['live-less-than-12-months'].severeCondition === 'no') {
        delete req.casa.journeyContext.data['sr1-report'];
      }
      JourneyContext.putContext(req.session, req.casa.journeyContext);
      req.session.save(next);
    },
  }];
