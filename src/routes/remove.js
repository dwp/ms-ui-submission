import Logger from '../lib/logger.js';
import genericDataUtils from '../lib/data-utils/genericDataUtils.js';
import { JourneyContext } from '@dwp/govuk-casa';

const appLogger = Logger();

export default (router, csrf) => {
  router.get('/remove', csrf, (req, res) => {
    const { removeSection, removeIndex } = req.session;
    if (removeSection !== undefined && removeIndex !== undefined) {
      switch (removeSection) {
        case 'condition':
          res.locals.removeItemName = req.session.conditionGather && req.session.conditionGather[removeIndex] && req.session.conditionGather[removeIndex].conditionName ? req.session.conditionGather[removeIndex].conditionName : '';
          break;
        case 'voluntary':
          res.locals.removeItemName = req.session.voluntaryGather && req.session.voluntaryGather[removeIndex] && req.session.voluntaryGather[removeIndex].organisationName ? req.session.voluntaryGather[removeIndex].organisationName : '';
          break;
        case 'employment':
          res.locals.removeItemName = req.session.employmentGather && req.session.employmentGather[removeIndex] && req.session.employmentGather[removeIndex].employerName ? req.session.employmentGather[removeIndex].employerName : '';
          break;
        default:
          return;
      }
    }
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
        page_path: '/remove',
      });
    } else {
      appLogger.info(`Section ${req.session.removeSection} in position ${req.session.removeIndex} does not exist: redirecting to check-your-answers`);
      res.status(302).redirect('/check-your-answers');
    }
  });

  router.post('/remove', csrf, (req, res, next) => {
    const formData = req.body;
    if (formData.remove === 'yes') {
      appLogger.info(`Removing ${req.session.removeIndex} from ${req.session.removeSection}Gather`);
      const removed = req.session[`${req.session.removeSection}Gather`].splice(req.session.removeIndex, 1);
      req.session.removeIndex = null;
      req.session.removed = removed;
      if (req.session[`${req.session.removeSection}Gather`].length === 0) {
        genericDataUtils.setInitialSectionQuestion(req.casa.journeyContext, req.session.removeSection, 'no', 'initial');
        if (req.session.removeSection === 'employment') {
          req.casa.journeyContext.setDataForPage('statutory-sick-pay', undefined);
          req.casa.journeyContext.setDataForPage('statutory-sick-pay-end', undefined);
          req.casa.journeyContext.setDataForPage('statutory-sick-pay-recent', undefined);
          req.session.editing = true;
          const employmentGather = req.session.employmentGathermentGather ? req.session.employmentGathermentGather : [];
          if (employmentGather && employmentGather.length === 0) {
            req.casa.journeyContext.setDataForPage('employed-ssp', { required: true });
            const statutoryPay = req.casa.journeyContext.data['statutory-pay'];
            const statutoryPayEndDate = req.casa.journeyContext.data['statutory-pay-end-date'];

            if (statutoryPay === 'yes' && statutoryPayEndDate === 'yes') {
              req.casa.journeyContext.setDataForPage('claim-start-date-after-statutory-sick-pay', undefined);
              JourneyContext.putContext(req.session, req.casa.journeyContext);
              appLogger.info('Last employment removed: statutory-pay = Yes & statutory-pay-end-date = Yes / redirecting to statutory-sick-pay-end');
              return req.session.save((err) => {
                if (err) {
                  appLogger.error(err);
                  next(err);
                } else {
                  res.redirect(302, '/statutory-sick-pay-end');
                }
              });
            }
            else {
              req.casa.journeyContext.setDataForPage('employed-ssp', { required: true });
              JourneyContext.putContext(req.session, req.casa.journeyContext);
              appLogger.info('Last employment removed: redirecting to statutory-sick-pay-recent');
              return req.session.save((err) => {
                if (err) {
                  appLogger.error(err);
                  next(err);
                } else {
                  res.redirect(302, '/statutory-sick-pay-recent');
                }
              });
            }
          }
        }
      }
      JourneyContext.putContext(req.session, req.casa.journeyContext);
      appLogger.info('Section removed: redirecting to check-your-answers');
      return req.session.save((err) => {
        if (err) {
          appLogger.error(err);
          next(err);
        } else {
          res.redirect(302, '/check-your-answers');
        }
      });
    } else {
      appLogger.info('Section not removed: redirecting to check-your-answers');
      res.redirect(302, '/check-your-answers');
    }
  });
};
