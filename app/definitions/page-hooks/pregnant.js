import { JourneyContext } from '@dwp/govuk-casa';

export default () => [
  {
    hook: 'preredirect',
    middleware: (req, res, next) => {
      if (req.casa.editMode && req.casa.journeyContext.data.pregnant.pregnant === 'no') {
        delete req.casa.journeyContext.data['pregnant-due-date'];
      }
      JourneyContext.putContext(req.session, req.casa.journeyContext);
      req.session.save(next);
    },
  }];
