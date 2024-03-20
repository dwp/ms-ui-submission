import logger from '../../lib/logger.js';
import conditionDataUtils from '../../lib/data-utils/conditionDataUtils.js';
import employmentDataUtils from '../../lib/data-utils/employmentDataUtils.js';
import genericDataUtils from '../../lib/data-utils/genericDataUtils.js';
import voluntaryDataUtils from '../../lib/data-utils/voluntaryDataUtils.js';
import anyLoopPages from '../../lib/section-pages.json' assert { type: 'json' };
import { JourneyContext } from '@dwp/govuk-casa';

const appLogger = logger();
/**
 * ExitPages is an array that contains the name of the last page in a looped journey
 * this allows the setting of a flag on the session to tell this middleware that it
 * needs to get involved if the user clicks back on the next page.
 *
 * @type {string[]}
 */
const pagesBeforeGatewayPage = {
  'doctor-declaration': 'voluntary',
  'voluntary-work-hours': 'voluntary',
  'voluntary-work': 'employment',
  'employment-expenses-details': 'employment',
  'employment-expenses': 'employment',
  'employment-last-work': 'employment',
  email: 'condition',
};

// start of loop
const gatewayPages = ['voluntary-work', 'employed', 'conditions'];

export default (req, res, next) => {
  appLogger.info('running navigation-override');
  const currentPage = req.path.substring(1, req.path.length).split('?')[0];
  const pageBeforeGatewayPage = pagesBeforeGatewayPage[currentPage];
  appLogger.info(`set currentPage to ${currentPage}`);
  appLogger.info(`set pageBeforeGatewayPage to ${pageBeforeGatewayPage}`);
  const edit = req.query.edit !== undefined;
  const cyaEdit = req.session.cyaEdit === edit;
  const editMode = edit && cyaEdit;

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
      case 'condition':
        appLogger.info('Processing conditions gather');
        if (req.session.conditionGather && req.session.conditionGather.length > 0) {
          appLogger.info('moving last condition entry from the gather to the journey');
          conditionDataUtils.populateConditionJourneyData(
            req,
            req.session.conditionGather[req.session.conditionGather.length - 1],
            res,
            next
          );
          if (req.session.conditionGather.length === 0) {
            req.casa.journeyContext.setDataForPage('another-health-condition', {
              anotherCondition: 'yes',
            });
          }
        } else {
          conditionDataUtils.clearConditionJourneyData(req);
        }
        break;
      case 'voluntary':
        appLogger.info('Processing voluntary gather');
        if (req.session.voluntaryGather && req.session.voluntaryGather.length > 0) {
          appLogger.info('moving last voluntary entry from the gather to the journey');
          req.session.voluntaryWorkSaved = false;
          voluntaryDataUtils.populateVoluntaryJourneyData(
            req,
            req.casa.journeyContext,
            req.session.voluntaryGather.pop(),
            res,
            next
          );
          if (req.session.voluntaryGather.length === 0) {
            req.casa.journeyContext.setDataForPage('voluntary-work', {
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
        if (currentPage !== 'voluntary-work' && req.casa.journeyContext.data.employed) {
          if (req.session.employmentGather && req.session.employmentGather.length > 0) {
            appLogger.info('moving last employment entry from the gather to the journey');
            req.session.employedSaved = false;
            employmentDataUtils.populateEmploymentJourneyData(
              req,
              req.casa.journeyContext,
              req.session.employmentGather.pop(),
              res,
              next
            );
            if (req.session.employmentGather.length === 0) {
              req.casa.journeyContext.setDataForPage('employed', {
                screen: 'employed',
                employed: 'yes',
                other: 'yes',
              });
            }
          } else {
            employmentDataUtils.clearEmploymentJourneyData(req);
          }
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
  const cyaPage = req.session.previousPage === 'check-your-answers';
  const sspPages = ['statutory-sick-pay-recent', 'statutory-sick-pay-end', 'statutory-sick-pay-recent', 'claim-start-date'];

  if (req.session && req.session.editing && !cyaPage && currentPage === 'check-your-answers' && req.casa.journeyContext.getValidationErrorsForPage(req.session.previousPage).length === 0
    && req.casa.journeyContext.data.employed && req.casa.journeyContext.data.employed.other === 'yes') {
    req.casa.journeyContext.data.employed.other = 'no';
  }

  if (req.session && req.session.editing && !cyaPage && currentPage === 'check-your-answers' && req.casa.journeyContext.getValidationErrorsForPage(req.session.previousPage).length === 0
    && req.casa.journeyContext.data['voluntary-work'] && req.casa.journeyContext.data['voluntary-work'].other === 'yes') {
    req.casa.journeyContext.data['voluntary-work'].other = 'no';
  }

  if (req.session && (req.casa.editMode || editMode) && (currentPage === 'voluntary-work-role' || currentPage === 'voluntary-work-hours') &&
        (!req.casa.journeyContext.hasValidationErrorsForPage('voluntary-work-details') || cyaPage || currentPage ===  req.session.previousPage)) {
    req.casa.journeyContext.validation['voluntary-work-details'] = null;
    req.casa.journeyContext.validation['voluntary-work-role'] = null;
  }

  if (req.session && req.session.editing && cyaPage && (currentPage === 'another-health-condition' || currentPage === 'conditions')) {
    req.casa.journeyContext.setDataForPage('another-condition', { cyaJourney: 'yes' });
  }
  else if (req.session && req.session.editing && cyaPage && currentPage === 'voluntary-work') {
    req.casa.journeyContext.setDataForPage('voluntary-work-cya', { cyaJourney: 'yes' });
  }
  else if (req.session && req.session.editing && cyaPage && (currentPage === 'employed' || req.session.editSection === 'employment')) {
    req.casa.journeyContext.setDataForPage('employed-cya', { cyaJourney: 'yes' });

    const workTypes = req.casa.journeyContext.data['employment-status'] && req.casa.journeyContext.data['employment-status'].workTypes ? req.casa.journeyContext.data['employment-status'].workTypes : null;
    req.session.employmentWorkTypes = workTypes ? workTypes : null;

    if (currentPage === 'employment-details' || currentPage === 'self-employment-details') {
      req.casa.journeyContext.setDataForPage('employment-details-cya', { cyaJourney: 'yes' });
    }
    else if (currentPage === 'employment-off-sick' || currentPage === 'employment-status') {
      req.casa.journeyContext.setDataForPage('employment-pages-cya', { cyaJourney: 'yes' });
    }
  }
  else if (req.session && req.session.editing && cyaPage && currentPage === 'statutory-pay') {
    req.casa.journeyContext.setDataForPage('statutory-pay-cya', { cyaJourney: 'yes' });
  }
  else if (req.session && req.session.editing && cyaPage && sspPages.includes(currentPage)) {
    const cyaData = currentPage === 'claim-start-date' ? { cyaJourney: 'yes', editClaimStart: true } : { cyaJourney: 'yes', editClaimStart: false };
    req.casa.journeyContext.setDataForPage('claim-start-date-cya', cyaData);
  }
  else if (req.session && req.session.editing && cyaPage && currentPage === 'claim-start-date-after-statutory-sick-pay') {
    req.casa.journeyContext.setDataForPage('claim-start-date-after-ssp-cya', { cyaJourney: 'yes' });
  }

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
  if (cyaPage && (Object.keys(anyLoopPages).indexOf(currentPage) > -1)) {
    appLogger.info('Setting cyaBackNavigationFlag to true');
    req.session.cyaBackNavigationFlag = true;
  } else {
    appLogger.info('Setting cyaBackNavigationFlag to false');
    req.session.cyaBackNavigationFlag = false;
  }

  if (req.session.anotherConditionBack === true) {
    req.casa.journeyContext.setDataForPage('back-another-condition', { back: 'yes' });
    req.session.anotherConditionBack = false;
  }
  req.session.previousPage = currentPage;
  appLogger.info('Saving session');
  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save(next);
};
