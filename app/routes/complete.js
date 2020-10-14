const moment = require('moment');
const Logger = require('../lib/Logger');

const appLogger = Logger();

module.exports = (casaApp, mountUrl, router) => {
  router.get('/complete', (req, res) => {
    if (!req.session.journeyData) {
      res.status(302).redirect('/welcome');
    } else if (!req.session.cyaVisited) {
      res.status(302).redirect('/check-your-answers');
    } else {
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
      if (req.journeyData.getDataForPage('employed').screen === 'employed-other') {
        p45Indicator = false;
      }
      appLogger.info(`p45 indicator set to ${p45Indicator}`);
      let sspIndicator = false;
      if ((req.journeyData.getDataForPage('statutory-sick-pay') && (req.journeyData.getDataForPage('statutory-sick-pay').ssp === 'yes'))
        || (req.journeyData.getDataForPage('statutory-sick-pay-recent') && (req.journeyData.getDataForPage('statutory-sick-pay-recent').sspRecent === 'yes'))) {
        sspIndicator = true;
      }
      appLogger.info(`ssp indicator set to ${sspIndicator}`);
      let pensionsIndicator = true;
      if (req.journeyData.getDataForPage('pension').pension) {
        //  This data item is only present if the answer to the pension question is either
        // 'no' or 'notsure'.
        //  If the answer to the pension question is 'yes', the pension page data is overwritten
        //  and the pension item no longer exists (see DatUtils).
        //  So if it is present then we want the pensions indicator to be set to false, because
        //  it's value can only be 'no' or 'notsure'.
        pensionsIndicator = false;
      }
      appLogger.info(`pensions indicator set to ${pensionsIndicator}`);
      const universalCredit = req.journeyData.getDataForPage('universal-credit').universalCredit === 'yes';
      const dataForCompletePage = {
        employerData: employerInfo,
        p45Indicator,
        sspIndicator,
        pensionsIndicator,
        fourteenDaysLater: moment().add(14, 'days').format('D MMMM YYYY'),
        universalCredit,
      };
      // Empty session of all citizen data.
      casaApp.endSession(req).then(() => {
        appLogger.info('End session');
        req.session.save((saveErr) => {
          appLogger.info('Save session');
          if (saveErr) {
            appLogger.info('Failed to save session after successful end');
            appLogger.error('Failed to save session after successful end. Error is: ', saveErr.message);
            appLogger.debug('Failed to save session after successful end; silent log', {
              err_message: saveErr.message,
              err_stack: saveErr.stack,
            });
          }
          res.render('pages/complete.njk', dataForCompletePage);
        });
      }).catch((err) => {
        appLogger.error('Error ending session', {
          err_message: err.message,
          err_stack: err.stack,
        });
        req.session.save((saveErr) => {
          if (saveErr) {
            appLogger.info('Failed to save session after failed end');
            appLogger.error('Failed to save session after failed end. Error : ', saveErr.message);
            appLogger.debug('Failed to save session after failed end; silent log', {
              err_message: saveErr.message,
              err_stack: saveErr.stack,
            });
          }
          appLogger.info('Render end screen page if session saved and ended successfully');
          res.render('pages/complete.njk', dataForCompletePage);
        });
      });
    }
  });
};
