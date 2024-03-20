import { DateTime } from 'luxon';
import Logger from '../lib/logger.js';

const appLogger = Logger();

export default (casaApp, mountUrl, router) => {
  router.get('/complete', (req, res) => {
    if (!req.session.journeyContext && !req.casa.journeyContext) {
      res.status(302).redirect('/welcome');
    } else if (!req.session.cyaVisited) {
      res.status(302).redirect('/eligibility-start');
    } else {
      req.journeyContext = req.session.journeyContext;
      const employerInfo = [];
      if (req.session.employmentGather) {
        appLogger.info('Set data needed for each employer, if there are any');
        let i;
        for (i = 0; i < req.session.employmentGather.length; i++) {
          if (req.session.employmentGather[i].frequency !== undefined) {
            const employer = {
              employerName: req.session.employmentGather[i].employerName,
              frequency: req.session.employmentGather[i].frequency,
            };
            employerInfo.push(employer);
          }
        }
      }
      let p45Indicator = true;
      if (req.journeyContext.employed.screen === 'employed-other') {
        p45Indicator = false;
      }
      appLogger.info(`p45 indicator set to ${p45Indicator}`);
      let sspIndicator = false;
      if ((req.journeyContext['statutory-sick-pay'] && (req.journeyContext['statutory-sick-pay'].ssp === 'yes'))
        || (req.journeyContext['statutory-sick-pay-recent'] && (req.journeyContext['statutory-sick-pay-recent'].sspRecent === 'yes'))) {
        sspIndicator = true;
      }
      appLogger.info(`ssp indicator set to ${sspIndicator}`);
      let pensionsIndicator = true;
      if (req.journeyContext.pension.pension) {
        //  This data item is only present if the answer to the pension question is either
        // 'no' or 'notsure'.
        //  If the answer to the pension question is 'yes', the pension page data is overwritten
        //  and the pension item no longer exists (see DatUtils).
        //  So if it is present then we want the pensions indicator to be set to false, because
        //  it's value can only be 'no' or 'notsure'.
        pensionsIndicator = false;
      }
      appLogger.info(`pensions indicator set to ${pensionsIndicator}`);
      const universalCredit = req.journeyContext['universal-credit'].universalCredit === 'yes';

      // Display SSP1 content
      const isRtiClaim = req.journeyContext['live-less-than-12-months'].severeCondition === 'yes';
      const isEmployee = req.session.employmentGather && req.session.employmentGather.some((employment) => employment.workTypes.some((workType) => workType === 'employee'));
      const isStatutorySickPayRecent = req.journeyContext['statutory-sick-pay-recent'] && req.journeyContext['statutory-sick-pay-recent'].sspRecent === 'yes';

      const displaySSP1Content = isRtiClaim
        ? false : isEmployee || isStatutorySickPayRecent;

      const dataForCompletePage = {
        employerData: employerInfo,
        p45Indicator,
        sspIndicator,
        pensionsIndicator,
        fourteenDaysLater: DateTime.now().plus({ days: 14 }).setLocale(req.language).toFormat('d MMMM yyyy'),
        universalCredit,
        displaySSP1Content,
        isRtiClaim,
      };

      req.session.destroy((endErr) => {
        appLogger.info('End session');
        if (endErr) {
          appLogger.error('Error ending session', {
            err_message: endErr.message,
            err_stack: endErr.stack,
          });
        }
        res.render('pages/complete.njk', dataForCompletePage);
      });
    }
  });
};
