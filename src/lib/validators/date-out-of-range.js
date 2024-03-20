import { DateTime } from 'luxon';
import { ValidatorFactory, ValidationError } from '@dwp/govuk-casa';

/**
 * DateOutOfRange - Checks that the input date is within a range defined by two bound dates.
 * The range check allows either of the range dates to be included
 *    (i.e. Considers them to be in range)
 *    (defaults to checking if the date is in the same year as the value date).
 *
 * @param {object} value Is a mandatory object containing the date being validated
 *          as dd, mm, and yyyy string properties of that object.
 * @returns {Promise} Resolved promise if date being checked is between two other dates,
 *    rejected promise, with error message, if it is.
 * Bound attributes:
 *   string|object errorMsg - error message
 *   function returning luxon - earliestDate - earliest date in range to check against
 *        (defaults to the start of the year of the value date)
 *   function returning luxon - latestDate - latest date in range to check against
 *        (defaults to the end of the year of the value date).
 */

class dateOutOfRange extends ValidatorFactory {
  validate(fieldValue, dataContext = {}) {
    let { dd, mm } = fieldValue;
    const { yyyy } = fieldValue;

    // Make day and month two digits
    dd = ('0' + dd).slice(-2);
    mm = ('0' + mm).slice(-2);

    const dayNum = dd.match(/^[0-9]{1,2}$/) !== null && parseInt(dd) > 0;
    const monNum = mm.match(/^[0-9]{1,2}$/) !== null && parseInt(mm) > 0;
    const yearNum = yyyy.match(/^[0-9]{2,4}$/) !== null && parseInt(yyyy) > 0;

    let validDate = dayNum && monNum && yearNum;

    if (validDate) {
      const valueDate = DateTime.fromISO(`${yyyy}-${mm}-${dd}`).startOf('day');
      validDate = (new Date(`${yyyy}-${mm}-${dd}`).toString() !== 'Invalid Date') && (valueDate.isValid);
    }

    const valueDate = DateTime.fromISO(`${yyyy}-${mm}-${dd}`).startOf('day');
    const startOfYear = () => DateTime.now().startOf('year');
    const endOfYear = () => DateTime.now().endOf('year');
    const config = {
      errorMsg: 'validation:rule.dateObject.inline',
      earliestDate: startOfYear,
      latestDate: endOfYear,
      ...this.config,
    };
    const { errorMsg, earliestDate, latestDate } = config;

    if (valueDate > latestDate() || valueDate < earliestDate() || !validDate) {
      return [ValidationError.make({ errorMsg, dataContext })];
    }
    return [];
  }
}

export default dateOutOfRange;
