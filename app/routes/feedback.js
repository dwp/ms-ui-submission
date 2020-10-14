const { notifyEmail } = require('../lib/NotifyService');
const Logger = require('../lib/Logger');

const appLogger = Logger();

module.exports = (router, csrfMiddleware, notifyEmailTo, notifyApiKey, notifyProxy, notifyUrl) => {
  router.get('/feedback', csrfMiddleware, (req, res) => {
    const refPage = req.headers.referer.split('/');
    let referringPage = refPage[refPage.length - 1];
    if (referringPage === '') {
      referringPage = 'index';
    }
    res.render('pages/feedback.njk', { feedbackPath: true, csrfToken: req.csrfToken(), referringPage });
  });
  router.post('/feedback', csrfMiddleware, (req, res) => {
    const {
      referringPage, rating, comments,
    } = req.body;
    const notifyTemplateData = {
      screen: referringPage,
      rating: rating || 'Not given',
      comments: comments || 'Not given',
    };
    const formErrors = [];
    if (!rating && !comments) {
      formErrors.push({ field: 'feedback-group', href: '#feedback-group', text: req.i18nTranslator.t('feedback:errors.required') });
    }
    if (formErrors.length === 0) {
      appLogger.info('No errors found in data; sending feedback via notify service');
      notifyEmail(notifyTemplateData, notifyEmailTo, notifyApiKey, notifyProxy, notifyUrl)
        .then(() => {
          appLogger.info('Feedback sent successfully');
          res.redirect('/thankyou');
        })
        .catch((err) => {
          appLogger.info('Error sending feedback via notify');
          appLogger.error('Error sending feedback via notify: ', err);
          res.status(500).render('casa/errors/500.njk');
        });
    } else {
      res.render('pages/feedback.njk', {
        feedbackPath: true,
        csrfToken: req.csrfToken(),
        referringPage,
        rating,
        comments,
        formErrors,
      });
    }
  });
};
