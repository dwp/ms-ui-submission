const Logger = require('../../lib/Logger');
const {
  employmentDataUtils, genericDataUtils, insuranceDataUtils, pensionDataUtils, voluntaryDataUtils,
} = require('../../lib/data-utils');

const appLogger = Logger();
const anyLoopPages = require('../../lib/section-pages');
/**
 * exitPages is an array that contains the name of the last page in a looped journey
 * this allows the setting of a flag on the session to tell this middleware that it
 * needs to get involved if the user clicks back on the next page.
 * @type {string[]}
 */
const pagesBeforeGatewayPage = {
  'doctor-declaration': 'voluntary',
  'voluntary-work-hours': 'voluntary',
  'voluntary-work': 'employment',
  'employment-expenses-details': 'employment',
  'employment-expenses': 'employment',
  'employment-status': 'employment',
  'pension-inherited': 'pension',
  'insurance-payment': 'insurance',
};

const gatewayPages = ['voluntary-work', 'employed', 'pension', 'insurance'];

module.exports = (req, res, next) => {
  appLogger.info('running navigation-override');
  const currentPage = req.path.substring(1, req.path.length).split('?')[0];
  const pageBeforeGatewayPage = pagesBeforeGatewayPage[currentPage];
  appLogger.info(`set currentPage to ${currentPage}`);
  appLogger.info(`set pageBeforeGatewayPage to ${pageBeforeGatewayPage}`);

  /**
   * Scenario 1
   * In the normal journey, after completing a loop
   * click back to go back into the loop.
   */
  // outside a loop > back into loop.
  // remove the last entry in the gather and put in journey
  if (req.session
    && req.session.backNavigationFlag
    && pageBeforeGatewayPage) {
    appLogger.info('backNavigationFlag and pageBeforeGatewayPage are set. Running scenario 1 switch');
    switch (pageBeforeGatewayPage) {
    case 'voluntary':
      appLogger.info('Processing voluntary gather');
      if (req.session.voluntaryGather && req.session.voluntaryGather.length > 0) {
        appLogger.info('moving last voluntary entry from the gather to the journey');
        voluntaryDataUtils.populateVoluntaryJourneyData(req.journeyData,
          req.session.voluntaryGather.pop());
        if (req.session.voluntaryGather.length === 0) {
          req.journeyData.setDataForPage('voluntary-work', {
            screen: 'voluntary-work',
            voluntaryWork: 'yes',
          });
        }
      } else {
        voluntaryDataUtils.clearVoluntaryJourneyData(req);
      }
      break;
    case 'employment':
      appLogger.info('Processing employment gather');
      if (currentPage !== 'voluntary-work') {
        if (req.session.employmentGather && req.session.employmentGather.length > 0) {
          appLogger.info('moving last employment entry from the gather to the journey');
          employmentDataUtils.populateEmploymentJourneyData(req.journeyData,
            req.session.employmentGather.pop());
          if (req.session.employmentGather.length === 0) {
            req.journeyData.setDataForPage('employed', {
              screen: 'employed',
              employed: 'yes',
            });
          }
        } else {
          employmentDataUtils.clearEmploymentJourneyData(req);
        }
      }

      break;
    case 'pension':
      appLogger.info('Processing pension gather');
      if (req.session.pensionGather && req.session.pensionGather.length > 0) {
        appLogger.info('moving last pension entry from the gather to the journey');
        pensionDataUtils.populatePensionJourneyData(req.journeyData,
          req.session.pensionGather.pop());
        if (req.session.pensionGather.length === 0) {
          req.journeyData.setDataForPage('pension', {
            screen: 'pension',
            pension: 'yes',
          });
        }
      } else {
        pensionDataUtils.clearPensionJourneyData(req);
      }
      break;
    case 'insurance':
      appLogger.info('Processing insurance gather');
      if (req.session.insuranceGather && req.session.insuranceGather.length > 0) {
        appLogger.info('moving last insurance entry from the gather to the journey');
        insuranceDataUtils.populateInsuranceJourneyData(req.journeyData,
          req.session.insuranceGather.pop(), true);
        if (req.session.insuranceGather.length === 0) {
          req.journeyData.setDataForPage('insurance', {
            screen: 'insurance',
            insurance: 'yes',
          });
        }
      } else {
        insuranceDataUtils.clearInsuranceJourneyData(req);
      }
      break;
    default:
      break;
    }
  }
  /**
   * Scenario 2
   * Start on the Check your answers page (cya)
   * edit a page and then go straight back to the cya page.
   */
  if (req.session && req.session.editing && currentPage === 'check-your-answers' && req.session.cyaBackNavigationFlag) {
    appLogger.info('Calling genericDataUtils.cancelEdit');
    genericDataUtils.cancelEdit(req);
  }

  if (gatewayPages.indexOf(currentPage) > -1) {
    appLogger.info('Setting backNavigationFlag to true');
    req.session.backNavigationFlag = true;
  } else {
    appLogger.info('Setting backNavigationFlag to false');
    req.session.backNavigationFlag = false;
  }
  // add this flag if we have just come from check your answers and we are inside a loop.
  if (req.session.previousPage === 'check-your-answers' && (Object.keys(anyLoopPages).indexOf(currentPage) > -1)) {
    appLogger.info('Setting cyaBackNavigationFlag to true');
    req.session.cyaBackNavigationFlag = true;
  } else {
    appLogger.info('Setting cyaBackNavigationFlag to false');
    req.session.cyaBackNavigationFlag = false;
  }
  req.session.previousPage = currentPage;
  appLogger.info('Saving session');
  return req.session.save(() => {
    next();
  });
};
