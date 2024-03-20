import { JourneyContext } from '@dwp/govuk-casa';

export default () => [
  {
    hook: 'preredirect',
    middleware: (req, res, next) => {
      if (req.casa.editMode && req.casa.journeyContext.data['hospital-inpatient'].hospitalInpatient === 'no') {
        delete req.casa.journeyContext.data['hospital-details'];
      }
      JourneyContext.putContext(req.session, req.casa.journeyContext);
      req.session.save(next);
    },
  }];
