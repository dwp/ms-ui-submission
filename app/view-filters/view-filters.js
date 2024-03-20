import { DateTime } from 'luxon';
import filter from './mergeObjectsDeep.js';

export default (env, router) => {
  router.use((req, res, next) => {
    env.addGlobal(
      'mergeObjects',
      filter,
    );

    env.addFilter('matchDay', (errorString) => Boolean(errorString && errorString.match(/day/i)));
    env.addFilter('matchMonth', (errorString) => Boolean(errorString && errorString.match(/month/i)));
    env.addFilter('matchYear', (errorString) => Boolean(errorString && errorString.match(/year/i)));
    env.addFilter('includesDay', (errType) => Boolean(errType && errType.includes('day')));
    env.addFilter('includesMonth', (errType) => Boolean(errType && errType.includes('month')));
    env.addFilter('includesYear', (errType) => Boolean(errType && errType.includes('year')));
    env.addFilter('date', (date) => {
      // Make day and month two digits
      const dd = (`0${date.dd}`).slice(-2);
      const mm = (`0${date.mm}`).slice(-2);
      const { yyyy } = date;
      return DateTime.fromISO(`${yyyy}-${mm}-${dd}`).setLocale(req.language).toFormat('d MMMM yyyy');
    });
    env.addFilter('dayAfterDate', (date) => {
      // Make day and month two digits
      const dd = (`0${date.dd}`).slice(-2);
      const mm = (`0${date.mm}`).slice(-2);
      const { yyyy } = date;
      return DateTime.fromISO(`${yyyy}-${mm}-${dd}`).plus({ days: 1 }).setLocale(req.language).toFormat('d MMMM yyyy');
    });
    next();
  });
};
