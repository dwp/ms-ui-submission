import { parse } from 'url';
import logger from '../../lib/logger.js';

const appLogger = logger();

const backLinkRoute = (router) => {
  router.get('/back', (req, res) => {
    const cyaJourney = req.casa.journeyContext.data['employed-cya'] && req.casa.journeyContext.data['employed-cya'].cyaJourney ? req.casa.journeyContext.data['employed-cya'].cyaJourney : 'no';
    appLogger.info('GET: back');
    if (
      (req.session.historyStack && req.session.historyStack.length > 0 && cyaJourney === 'no') || 
      (req.session.historyStack && req.session.historyStack.length > 0 && cyaJourney === 'yes' && req.session.historyStack.pop().path === '/check-your-answers')
    ) {
      const redirectPath = req.session.historyStack.pop().path;
      req.session.backClicked = true;
      appLogger.info(`redirecting to ${redirectPath}`);
      req.session.save(() => {
        res.status(302).redirect(redirectPath);
      });
    }
    else {
      const referrer = req.get('Referrer');
      if (parse(referrer).host === req.headers.host) {
        appLogger.info(`redirecting back to ${referrer}`);
        res.status(302).redirect(referrer);
      } else {
        appLogger.info('Possible open redirect attempt. redirecting to /');
        res.status(302).redirect('/');
      }
    }
  });
};

export default {
  backLinkRoute,
};