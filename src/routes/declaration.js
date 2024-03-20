/* eslint-disable max-len */
import Logger from '../lib/logger.js';
import dataMapper from '../lib/DataMapper.js';
import templates from '../lib/constants/sms-constants.js';

const appLogger = Logger();

export default (casaApp, mountUrl, router, csrf, submissionService, processNotifications, config) => {
  router.get('/declaration', csrf, (req, res, next) => {
    if (req.query && req.query.error === '500-submission-error') {
      res.status(500).render('casa/errors/500-submission-error.njk');
    } else if (!req.session.journeyContext && !req.casa.journeyContext) {
      res.status(302).redirect('/welcome');
    } else if (req.session.cyaVisited) {
      next();
    } else {
      res.status(302).redirect('/eligibility-start');
    }
  });
  casaApp.post('/declaration', (req, res, next) => {
    if (!req.session.journeyContext) {
      res.status(302).redirect('/declaration?error=500-submission-error');
    } else {
      next();
    }
  });

  router.post('/declaration', csrf, (req, res, next) => {
    function gotoThankYou() {
      appLogger.info('Redirecting to end screen (complete page)');
      next();
    }

    function gotoError(msg, err) {
      appLogger.error(`${msg} - ${err.status_code}`, err);
      res.status(500).render('casa/errors/500-submission-error.njk');
    }

    function gotoBadRequestError(msg, err) {
      appLogger.error(`${msg} - ${err.status_code}`, err);
      req.session.destroy((endErr) => {
        if (endErr) {
          appLogger.error('Error ending session', {
            err_message: endErr.message,
            err_stack: endErr.stack,
          });
        }
        res.status(400).render('casa/errors/400-submission-error.njk');
      });
    }

    if (req.session.cyaVisited) {
      appLogger.info('Set up application data to send to Submission Handler');
      const data = dataMapper(
        req.t,
        req.session.journeyContext,
        req.session,
        req.session.applicationRef,
      );

      appLogger.info('Send application data for (ref: %s)', req.session.applicationRef);
      submissionService.sendApplication(data)
        .then(async (response) => {
          if (response.statusCode === 200) {
            appLogger.info('Application accepted by Submission Handler');
            if (req.session.journeyContext.mobile.mobile === 'yes') {
              const mobileNo = req.session.journeyContext.mobile.number.replace(/[()]/g, '').replace(/\s/g, '').replace('-', '');
              const smsTemplateId = data.language === 'en' ? templates.SMS_EN_TEMPLATE : templates.SMS_CY_TEMPLATE;
              appLogger.debug('SMS template id:', smsTemplateId);
              try {
                appLogger.info('SMS notification triggered');
                const { MessageId } = await processNotifications(mobileNo, smsTemplateId, config);
                appLogger.info(`notification message sent to SQS id: ${MessageId}`);
              } catch (err) {
                appLogger.error('Error processing sms notification', err);
              }
            }
            gotoThankYou();
          } else {
            gotoError('Error returned from Submission Handler', {
              status_code: response.statusCode,
              response_body: response.body,
            });
          }
        })
        .catch((err) => {
          if (err.statusCode === 400) {
            gotoBadRequestError('Bad request error returned from Submission Handler', {
              status_code: err.statusCode,
              response_body: err.body,
            });
          } else if (err.statusCode === 409) {
            appLogger.info('Duplicate application submitted to Submission Handler with application-ref: %s', req.session.applicationRef);
            gotoThankYou();
          } else {
            gotoError('Error submitting application to Submission Handler', {
              status_code: err.statusCode,
              err_message: err.message,
              err_stack: err.stack,
            });
          }
        });
    } else {
      res.status(302).redirect('/welcome');
    }
  });
};
