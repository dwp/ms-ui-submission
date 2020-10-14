const Logger = require('../lib/Logger');
const { genericDataUtils } = require('../lib/data-utils');

const appLogger = Logger();

module.exports = (router, csrf) => {
  router.post('/cancel', csrf, (req, res) => {
    if (typeof req.session.editPage !== 'undefined'
        && typeof req.session[`${req.session.editSection}Gather`] !== 'undefined'
        && typeof req.session[`${req.session.editSection}Gather`][req.session.editIndex] !== 'undefined') {
      appLogger.info('Determine section from which to cancel');
      genericDataUtils.cancelEdit(req);
      appLogger.info('Cancelled edit: redirecting to check-your-answers');
      req.session.save(() => {
        res.status(302).redirect('/check-your-answers');
      });
    } else {
      appLogger.info('Cannot cancel edit: redirecting to next page');
      res.status(302).redirect('/check-your-answers');
    }
  });
};
