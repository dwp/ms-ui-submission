import Logger from '../lib/logger.js';
import conditionDataUtils from '../lib/data-utils/conditionDataUtils.js';
import employmentDataUtils from '../lib/data-utils/employmentDataUtils.js';
import voluntaryDataUtils from '../lib/data-utils/voluntaryDataUtils.js';
import pages from '../lib/section-pages.json' assert { type: 'json' };
import mwJourneyRails from '../middleware/journey-rails.js'
import { JourneyContext } from '@dwp/govuk-casa';
import saveJourneyContext from '../lib/data-utils/saveJourneyContext.js';

const appLogger = Logger();

export default (router, csrf, mountUrl, userJourney) => {
  // Create some middleware that keeps the journey on track, i.e. prevents user
  // from progressing to the 'check-your-answers' waypoint unless they have
  // completed all previous waypoints.
  // This is required because there is no page meta for `check-your-answers`
  // and as a result, it will not have the usual CASA middleware applied to it
  if (mountUrl === undefined) {
    throw new ReferenceError('Missing mountUrl parameter');
  }
  if (userJourney === undefined) {
    throw new ReferenceError('Missing userJourney parameter');
  }
  const railsMiddleware = mwJourneyRails(mountUrl, userJourney);

  router.get('/check-your-answers', railsMiddleware, csrf, (req, res, next) => {
    const { page, index} = req.query;
    const { editing, editSection, editIndex } = req.session;

    if (editing && editSection && editIndex) {
      const { screen } = req.casa.journeyContext.data.employed && req.casa.journeyContext.data.employed.screen ? req.casa.journeyContext.data.employed : null;
      const voluntaryWorkscreen = req.session.voluntaryGather && req.session.voluntaryGather.length > 0 ? 'voluntary-work-other' : 'voluntary-work';
      switch (editSection) {
        case 'condition':
          conditionDataUtils.updateSpecificCondition(
            req.casa.journeyContext.data,
            req,
            req.session.editIndex,
          );
          req.casa.journeyContext.setDataForPage('another-health-condition', { anotherCondition: 'no' });
          break;
        case 'voluntary':
          if (!req.casa.journeyContext.hasValidationErrorsForPage('voluntary-work-details') && !req.casa.journeyContext.hasValidationErrorsForPage('voluntary-work-role')
            && !req.casa.journeyContext.hasValidationErrorsForPage('voluntary-work-hours')) {
              voluntaryDataUtils.updateSpecificVoluntary(
                  req,
              );
          }
          req.casa.journeyContext.setDataForPage('voluntary-work', { voluntaryWork: 'no', other: 'no', screen: voluntaryWorkscreen });
          break;
        case 'employment':
          employmentDataUtils.updateSpecificEmployment(
            req.casa.journeyContext.data,
            req,
          );
          req.casa.journeyContext.setDataForPage('employed', { employed: 'no', other: 'no', screen });
          break;
        default:
          break;
      }
      delete req.session.editIndex;
      delete req.session.editSection;
      JourneyContext.putContext(req.session, req.casa.journeyContext);
      req.session.save();
    }

    if (typeof page !== 'undefined'
      && Number.isInteger(Number(index))
      && Number.isInteger(Number(index)) >= 0
      && typeof req.session[`${page}Gather`] !== 'undefined'
      && typeof req.session[`${page}Gather`][index] !== 'undefined') {
      appLogger.info(`check-your-answers: requesting to remove ${page} in position ${index}`);

      req.session.removeSection = page;
      req.session.removeIndex = index;

      req.session.save(() => {
        res.status(302).redirect('/remove');
      });
    } else if (typeof pages[page] !== 'undefined'
      && typeof req.session[`${pages[page]}Gather`] !== 'undefined'
      && typeof req.session[`${pages[page]}Gather`][index] !== 'undefined') {
      appLogger.info(`check-your-answers: requesting to edit ${page} in position ${index}`);

      req.session.editIndex = index;
      req.session.editPage = page;
      req.session.editSection = pages[page];

      switch (pages[page]) {
        case 'condition':
          conditionDataUtils.populateConditionJourneyData(
            req,
            req.session.conditionGather[index],
            res,
            next,
            page
          );
          break;
        case 'voluntary':
          voluntaryDataUtils.populateVoluntaryJourneyData(
            req,
            req.casa.journeyContext,
            req.session.voluntaryGather[index],
            res,
            next,
            page
          );
          break;
        case 'employment':
          employmentDataUtils.populateEmploymentJourneyData(
            req,
            req.casa.journeyContext,
            req.session.employmentGather[index],
            res,
            next,
            page
          );
          if (page === 'employment-status') {
            req.session.isSelfEmployed = req.session.employmentGather[index].selfEmployed;
          }
          break;
        default:
          break;
      }

    } else if (req.casa.journeyContext.data['statutory-sick-pay-end'] === undefined && (req.casa.journeyContext.data.employed.other === 'no' || req.casa.journeyContext.data.employed.employed === 'no') &&
      (req.casa.journeyContext.data['statutory-pay'].statutoryPay === 'yes' || (req.casa.journeyContext.data['statutory-pay'].statutoryPay === 'no' && req.casa.journeyContext.data['statutory-sick-pay-recent'].sspRecent === 'yes'))) {
        saveJourneyContext(req, res, next, '/statutory-sick-pay-recent')
    }
    else {
      appLogger.info(`${req.method}: ${req.path}`);
      req.casa.journeyContext.setDataForPage('another-condition', { cyaJourney: 'no' });
      req.casa.journeyContext.setDataForPage('voluntary-work-cya', { cyaJourney: 'no' });
      req.casa.journeyContext.setDataForPage('employed-cya', { cyaJourney: 'no' });
      req.casa.journeyContext.setDataForPage('employment-details-cya', { cyaJourney: 'no' });
      req.casa.journeyContext.setDataForPage('employment-pages-cya', { cyaJourney: 'no' });
      req.casa.journeyContext.setDataForPage('statutory-pay-cya', { cyaJourney: 'no' });
      req.casa.journeyContext.setDataForPage('claim-start-date-cya', { cyaJourney: 'no' });
      req.casa.journeyContext.setDataForPage('claim-start-date-after-ssp-cya', { cyaJourney: 'no', editClaimStart: false });
      req.casa.journeyContext.setDataForPage('employed-ssp', { required: false })
      req.session.editing = true;
      delete req.session.editIndex;
      delete req.session.editPage;
      delete req.session.editSection;
      delete req.session.removeSection;
      delete req.session.removeIndex;
      req.session.employmentEdit = false;
      req.session.cyaOther = false;
      req.session.cyaEdit = true;
      employmentDataUtils.clearEmploymentJourneyData(req, true);
      voluntaryDataUtils.clearVoluntaryJourneyData(req, true);

      JourneyContext.putContext(req.session, req.casa.journeyContext);
      return req.session.save(() => {
        res.render('pages/check-your-answers.njk', {
          csrfToken: req.csrfToken(),
          journeyData: req.casa.journeyContext.data,
          voluntaryGather: req.session.voluntaryGather,
          employmentGather: req.session.employmentGather,
          pensionGather: req.session.pensionGather,
          insuranceGather: req.session.insuranceGather,
          conditionGather: req.session.conditionGather,
          originalUrl: req.originalUrl || '/check-your-answers',
          page_path: '/check-your-answers',
        });
      });
    }
  });

  router.post('/check-your-answers', railsMiddleware, csrf, (req, res, next) => {
    if (req.body.reviewed === 'true') {
      appLogger.info('check-your-answers: answers reviewed; redirect to declaration page');
      req.session.journeyContext = req.casa.journeyContext.data;
      req.session.cyaVisited = true;
      next();
    }
  });
};
