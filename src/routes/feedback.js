import notifyService from '../lib/NotifyService.js';
import Logger from '../lib/logger.js';

const appLogger = Logger();

export default (router, csrfMiddleware, notifyEmailTo, notifyApiKey, notifyProxy, notifyUrl) => {
  router.get('/feedback', csrfMiddleware, (req, res) => {
    const refPage = req.headers.referer.split('/');
    let referringPage = refPage[refPage.length - 1];
    if (referringPage === '') {
      referringPage = 'index';
    }
    res.render('pages/feedback.njk', {
      feedbackPath: true, csrfToken: req.csrfToken(), referringPage, buttonBarHidden: true,
    });
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
      formErrors.push({ field: 'feedback-group', href: '#feedback-group', text: req.t('feedback:errors.required') });
    }
    if (comments.length > 1200) {
      formErrors.push({ field: 'feedback-comment', href: '#feedback-comment', text: req.t('feedback:errors.maxLength') });
    }
    if (formErrors.length === 0) {
      appLogger.info('No errors found in data; sending feedback via notify service');
      notifyService.notifyEmail(notifyTemplateData, notifyEmailTo, notifyApiKey, notifyProxy, notifyUrl)
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
        buttonBarHidden: true,
      });
    }
  });
};
