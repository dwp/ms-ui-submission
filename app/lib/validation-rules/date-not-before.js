const moment = require('moment');

/**
 * dateNotBefore - checks that the date is not before another date (default is today)
 *
 * @param {object} value is a mandatory object containing the date being validated
 *          as dd, mm, and yyyy string properties of that object.
 *
 * @param {object} dataContext is a optional object containing the date of page being validated
 *
 * @returns {Promise} resolved promise if value date being checked is not before
 *        other date, rejected promise, with error message, if it is
 * Bound attributes:
 *   string|object errorMsg - error message
 *   function returning moment - dateToCheckAgainst - date to check value against (default is today)
 */
function dateNotBefore(value, dataContext = {}) {
  let dateToCheck = () => moment().startOf('day');
  if (dataContext.fieldName === 'claimEndDate') {
    const hiddenClaimStartDate = JSON.parse(dataContext.pageData.hiddenClaimStartDate);
    const claimStartDateDay = hiddenClaimStartDate.dd;
    const claimStartDateMonth = hiddenClaimStartDate.mm;
    const claimStartDateYear = hiddenClaimStartDate.yyyy;
    dateToCheck = () => moment(`${claimStartDateYear}-${claimStartDateMonth}-${claimStartDateDay}`, 'YYYY-MM-DD').endOf('day');
  } else if (dataContext.fieldName === 'claimStartDate') {
    if (dataContext.pageData.hiddenSspEndDate === 'not-entered') {
      return new Promise((resolve) => {
        resolve();
      });
    }
    const hiddenSspEndDate = JSON.parse(dataContext.pageData.hiddenSspEndDate);
    const sspEndDateDay = hiddenSspEndDate.dd;
    const sspEndDateMonth = hiddenSspEndDate.mm;
    const sspEndDateYear = hiddenSspEndDate.yyyy;
    dateToCheck = () => moment(`${sspEndDateYear}-${sspEndDateMonth}-${sspEndDateDay}`, 'YYYY-MM-DD').endOf('day');
  }
  const { dd, mm, yyyy } = value;
  const valueDate = moment(`${yyyy}-${mm}-${dd}`, 'YYYY-MM-DD').startOf('day');
  const config = {
    errorMsg: 'validation:rule.dateObject.inline',
    dateToCheckAgainst: dateToCheck,
    ...this,
  };
  const { errorMsg, dateToCheckAgainst } = config;
  return new Promise((resolve, reject) => {
    if (valueDate.isBefore(dateToCheckAgainst())) {
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

module.exports = dateNotBefore;
