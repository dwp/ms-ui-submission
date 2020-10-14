const moment = require('moment');

/**
 * dateNotAfter - checks that the date is not after another date (defaults to today)
 *
 * @param {object} value is a mandatory object containing the date being validated
 *          as dd, mm, and yyyy string properties of that object.
 *
 * @returns {Promise} resolved promise if date being checked is after another date,
 *    rejected promise, with error message, if it is
 * Bound attributes:
 *   string|object errorMsg - error message
 *   function returning moment - dateToCheckAgainst - date to check value against (default is today)
 */
function dateNotAfter(value) {
  const { dd, mm, yyyy } = value;
  const valueDate = moment(`${yyyy}-${mm}-${dd}`, 'YYYY-MM-DD').startOf('day');
  const today = () => moment().startOf('day');
  const config = {
    errorMsg: 'validation:rule.dateObject.inline',
    dateToCheckAgainst: today,
    ...this,
  };
  const { errorMsg, dateToCheckAgainst } = config;
  return new Promise((resolve, reject) => {
    if (valueDate.isAfter(dateToCheckAgainst())) {
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

module.exports = dateNotAfter;
