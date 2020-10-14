const Validation = require('@dwp/govuk-casa/lib/Validation');
const Logger = require('../lib/Logger');
const { genericDataUtils } = require('../lib/data-utils');
const removeValidators = require('../definitions/field-validators/remove');

const appLogger = Logger();

module.exports = (router, csrf) => {
  router.get('/remove', csrf, (req, res) => {
    if (typeof req.session.removeSection !== 'undefined'
      && typeof req.session.removeIndex !== 'undefined'
      && typeof req.session[`${req.session.removeSection}Gather`] !== 'undefined'
      && typeof req.session[`${req.session.removeSection}Gather`][req.session.removeIndex] !== 'undefined') {
      appLogger.info(`Request to remove section ${req.session.removeSection} in position ${req.session.removeIndex} from ${req.session.removeSection}Gather`);
      res.render('pages/remove.njk', {
        csrfToken: req.csrfToken(),
        gather: req.session[`${req.session.removeSection}Gather`],
        section: req.session.removeSection,
        index: req.session.removeIndex,
      });
    } else {
      appLogger.info(`Section ${req.session.removeSection} in position ${req.session.removeIndex} does not exist: redirecting to check-your-answers`);
      res.status(302).redirect('/check-your-answers');
    }
  });

  router.post('/remove', csrf, (req, res) => {
    const formData = req.body;
    Validation.processor(removeValidators, formData, {
      reduceErrors: true,
    }).then(() => {
      if (formData.remove === 'yes') {
        appLogger.info(`Removing ${req.session.removeIndex} from ${req.session.removeSection}Gather`);
        const removed = req.session[`${req.session.removeSection}Gather`].splice(req.session.removeIndex, 1);
        req.session.removeIndex = null;
        req.session.removed = removed;
        if (req.session[`${req.session.removeSection}Gather`].length === 0) {
          genericDataUtils.setInitialSectionQuestion(req.journeyData, req.session.removeSection, 'no', 'initial');
          if (req.session.removeSection === 'employment') {
            req.journeyData.setDataForPage('statutory-sick-pay', undefined);
            req.journeyData.setDataForPage('statutory-sick-pay-end', undefined);
            req.journeyData.setDataForPage('statutory-sick-pay-recent', undefined);
            req.journeyData.setDataForPage('statutory-sick-pay-recent-end', undefined);
            req.session.editing = true;
          }
        }
        req.session.save(() => {
          appLogger.info('Section removed: redirecting to check-your-answers');
          res.status(302).redirect('/check-your-answers');
        });
      } else {
        appLogger.info('Section not removed: redirecting to check-your-answers');
        res.status(302).redirect('/check-your-answers');
      }
    }).catch((errors) => {
      appLogger.info('Re-display remove page if there were errors');
      res.render('pages/remove.njk', {
        csrfToken: req.csrfToken(),
        gather: req.session[`${req.session.removeSection}Gather`],
        section: req.session.removeSection,
        index: req.session.removeIndex,
        formData,
        formErrors: errors,
      });
    });
  });
};
