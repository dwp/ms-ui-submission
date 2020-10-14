const mwJourneyRails = require('@dwp/govuk-casa/middleware/page/journey-rails.js');
const Logger = require('../lib/Logger');
const {
  employmentDataUtils, insuranceDataUtils, pensionDataUtils, voluntaryDataUtils,
} = require('../lib/data-utils');
const pages = require('../lib/section-pages');

const appLogger = Logger();

module.exports = (router, csrf, mountUrl, userJourney) => {
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
  const railsMiddleware = mwJourneyRails(mountUrl, [userJourney]);

  router.get('/check-your-answers', railsMiddleware, csrf, (req, res) => {
    const { page, index } = req.query;

    if (typeof page !== 'undefined'
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
      case 'voluntary':
        voluntaryDataUtils.populateVoluntaryJourneyData(req.journeyData,
          req.session.voluntaryGather[index]);
        break;
      case 'insurance':
        insuranceDataUtils.populateInsuranceJourneyData(req.journeyData,
          req.session.insuranceGather[index], page === 'insurance-payment');
        break;
      case 'pension':
        pensionDataUtils.populatePensionJourneyData(req.journeyData,
          req.session.pensionGather[index]);
        break;
      case 'employment':
        employmentDataUtils.populateEmploymentJourneyData(req.journeyData,
          req.session.employmentGather[index]);
        break;
      default:
        break;
      }
      req.session.save(() => {
        appLogger.info('Redirect to relevant page for edit');
        res.status(302).redirect(`/${page}?edit`);
      });
    } else {
      appLogger.info(`${req.method}: ${req.path}`);
      req.session.editing = false;
      req.session.editIndex = null;
      req.session.editPage = null;
      req.session.editSection = null;
      req.session.removeSection = null;
      req.session.removeIndex = null;
      res.render('pages/check-your-answers.njk', {
        csrfToken: req.csrfToken(),
        journeyData: req.journeyData.getData(),
        voluntaryGather: req.session.voluntaryGather,
        employmentGather: req.session.employmentGather,
        pensionGather: req.session.pensionGather,
        insuranceGather: req.session.insuranceGather,
      });
    }
  });

  router.post('/check-your-answers', railsMiddleware, csrf, (req, res) => {
    if (req.body.reviewed === 'true') {
      appLogger.info('check-your-answers: answers reviewed; redirect to declaration page');
      req.session.cyaVisited = true;
      req.session.save(() => {
        res.status(302).redirect('/declaration');
      });
    }
  });
};
