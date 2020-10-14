const Logger = require('../../lib/Logger');

const appLogger = Logger();

const rules = {};

require('fs').readdirSync(`${__dirname}/`).forEach((file) => {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    const name = file.replace('.js', '');
    /* eslint-disable-next-line import/no-dynamic-require, global-require */
    rules[name] = require(`./${file}`);
  }
});

const navigateToNextPage = (req, res, next) => {
  if (rules[req.journeyWaypointId]) {
    appLogger.info('Navigation rules: index - run navigation rules for next page');
    rules[req.journeyWaypointId](req, res, next);
  }
  if (req.session.editing === true) {
    appLogger.info('Navigation rules: index - navigate back to check-your-answers if in edit mode');
    req.session.save(() => {
      res.status(302).redirect('/check-your-answers');
    });
  } else {
    next();
  }
};

module.exports = navigateToNextPage;
