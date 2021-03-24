const Logger = require('../lib/Logger');
const dataMapper = require('../lib/DataMapper');
const smsTemplate = require('../template/sms-notification.json');
const smsConstants = require('../lib/constants/sms-constants.js');

const appLogger = Logger();

module.exports = (casaApp, mountUrl, router, csrf, submissionService, notificationService) => {
  router.get('/declaration', csrf, (req, res) => {
    if (!req.session.journeyData) {
      res.status(302).redirect('/welcome');
    } else if (req.session.cyaVisited) {
      res.render('pages/declaration.njk', { csrfToken: req.csrfToken() });
    } else {
      res.status(302).redirect('/check-your-answers');
    }
  });

  router.post('/declaration', csrf, (req, res) => {
    function gotoThankYou() {
      appLogger.info('Redirecting to end screen (complete page)');
      res.status(302).redirect(`${mountUrl}complete`);
    }

    function gotoError(msg, err) {
      appLogger.error(`${msg} - ${err.status_code}`, err);
      res.status(500).render('casa/errors/500-submission-error.njk');
    }

    function gotoBadRequestError(msg, err) {
      appLogger.error(`${msg} - ${err.status_code}`, err);
      casaApp.endSession(req).then(() => {
        res.status(400).render('casa/errors/400-submission-error.njk');
      }).catch((error) => {
        appLogger.error('Error ending session', {
          err_message: error.message,
          err_stack: error.stack,
        });
      });
    }

    if (req.session.cyaVisited) {
      appLogger.info('Set up application data to send to Submission Handler');
      const data = dataMapper(
        req.i18nTranslator,
        req.journeyData,
        req.session,
        req.session.applicationRef,
      );

      appLogger.info('Send application data for (ref: %s)', req.session.applicationRef);
      submissionService.sendApplication(data)
        .then((response) => {
          if (response.statusCode === 200) {
            appLogger.info('Application accepted by Submission Handler');
            if (req.session.journeyData.mobile.mobile === 'yes') {
              const mobileNo = req.session.journeyData.mobile.number.replace(/[()]/g, '').replace(/\s/g, '').replace('-', '');
              const smsTemplateId = data.data_capture.language === 'en' ? smsConstants.SMS_EN_TEMPLATE : smsConstants.SMS_CY_TEMPLATE;
              appLogger.debug('SMS template id:', smsTemplateId);
              const smsNotificationData = JSON.parse(JSON.stringify(smsTemplate).replace('$mobile_no$', mobileNo).replace('$template_id$', smsTemplateId));
              notificationService.sendNotification(smsNotificationData)
                .then((resp) => {
                  if (resp.statusCode === 202) {
                    appLogger.info('SMS accepted by Notification Service');
                  } else {
                    appLogger.warn('Issue with SMS Notification Service, received status code:', resp.statusCode);
                  }
                }).catch((err) => {
                  appLogger.error('Issue with SMS Notification Service', err.message);
                });
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
