const moment = require('moment');

/**
 * dateOutOfRange - checks that the input date is within a range defined by two bound dates
 * The range check allows either of the range dates to be included
 *    (i.e. considers them to be in range)
 *    (defaults to checking if the date is in the same year as the value date)
 *
 * @param {object} value is a mandatory object containing the date being validated
 *          as dd, mm, and yyyy string properties of that object.
 *
 * @returns {Promise} resolved promise if date being checked is between two other dates,
 *    rejected promise, with error message, if it is
 * Bound attributes:
 *   string|object errorMsg - error message
 *   function returning moment - earliestDate - earliest date in range to check against
 *        (defaults to the start of the year of the value date)
 *   function returning moment - latestDate - latest date in range to check against
 *        (defaults to the end of the year of the value date)
 */
function dateOutOfRange(value) {
  const { dd, mm, yyyy } = value;
  const valueDate = moment(`${yyyy}-${mm}-${dd}`, 'YYYY-MM-DD').startOf('day');
  const startOfYear = () => moment().startOf('year');
  const endOfYear = () => moment().endOf('year');
  const config = {
    errorMsg: 'validation:rule.dateObject.inline',
    earliestDate: startOfYear,
    latestDate: endOfYear,
    ...this,
  };
  const { errorMsg, earliestDate, latestDate } = config;
  return new Promise((resolve, reject) => {
    if (!valueDate.isBetween(earliestDate(), latestDate(), 'days', '[]')) {
      /* eslint-disable-next-line prefer-promise-reject-errors */
      reject({
        inline: errorMsg,
        summary: errorMsg,
        focusSuffix: ['[dd]'],
      });
    } else {
      resolve();
    }
  });
}

module.exports = dateOutOfRange;
