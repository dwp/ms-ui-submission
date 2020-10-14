const moment = require('moment');
const filter = require('../view-filters/mergeObjectsDeep.js');

module.exports = (app) => {
  app.get('nunjucksEnv').addGlobal(
    'mergeObjectsDeep',
    filter,
  );
  app.get('nunjucksEnv').addFilter(
    'matchDay', (errorString) => Boolean(errorString && errorString.match(/day/i)),
  );
  app.get('nunjucksEnv').addFilter(
    'matchMonth', (errorString) => Boolean(errorString && errorString.match(/month/i)),
  );
  app.get('nunjucksEnv').addFilter(
    'matchYear', (errorString) => Boolean(errorString && errorString.match(/year/i)),
  );
  app.get('nunjucksEnv').addFilter(
    'includesDay', (errType) => Boolean(errType && errType.includes('day')),
  );
  app.get('nunjucksEnv').addFilter(
    'includesMonth', (errType) => Boolean(errType && errType.includes('month')),
  );
  app.get('nunjucksEnv').addFilter(
    'includesYear', (errType) => Boolean(errType && errType.includes('year')),
  );
  app.get('nunjucksEnv').addFilter(
    'date', (date) => moment(`${date.yyyy}-${date.mm}-${date.dd}`, 'YYYY-MM-DD').format('D MMMM YYYY'),
  );
};
