import { DateTime } from 'luxon';
import { ValidatorFactory, ValidationError } from '@dwp/govuk-casa';

/**
 * DateNotBefore - checks that the date is not before another date (default is today).
 *
 * @param {object} value Is a mandatory object containing the date being validated
 *          as dd, mm, and yyyy string properties of that object.
 * @param {object} dataContext Is a optional object containing the date of page being validated.
 * @returns {Promise} Resolved promise if value date being checked is not before
 *        other date, rejected promise, with error message, if it is
 * Bound attributes:
 *   string|object errorMsg - error message
 *   function returning luxon - dateToCheckAgainst - date to check against (default is today).
 */

class dateNotBefore extends ValidatorFactory {

  validate(fieldValue, dataContext = {}) {
    let dateToCheck = () => DateTime.now().startOf('day');
    if (dataContext.fieldName === 'claimEndDate') {
      let { hiddenClaimStartDate } = dataContext.journeyContext.data['claim-end-date'];
      hiddenClaimStartDate = JSON.parse(hiddenClaimStartDate);
      const claimStartDateDay = parseInt(hiddenClaimStartDate.dd, 10);
      const claimStartDateMonth = parseInt(hiddenClaimStartDate.mm, 10);
      const claimStartDateYear = parseInt(hiddenClaimStartDate.yyyy, 10);
      dateToCheck = () => DateTime.utc(claimStartDateYear, claimStartDateMonth, claimStartDateDay).endOf('day');
    } else if (dataContext.fieldName === 'claimStartDate') {
      let { hiddenSspEndDate } = dataContext.journeyContext.data['claim-start-date'];
      if (hiddenSspEndDate === 'not-entered') {
        return [];
      }
      hiddenSspEndDate = JSON.parse(hiddenSspEndDate);
      const sspEndDateDay = parseInt(hiddenSspEndDate.dd, 10);
      const sspEndDateMonth = parseInt(hiddenSspEndDate.mm, 10);
      const sspEndDateYear = parseInt(hiddenSspEndDate.yyyy, 10);
      dateToCheck = () => DateTime.utc(sspEndDateYear, sspEndDateMonth, sspEndDateDay).endOf('day');
    }

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
    const config = {
      errorMsg: { summary: 'validation:rule.dateObject.inline' },
      dateToCheckAgainst: dateToCheck,
      ...this.config,
    };

    const { errorMsg, dateToCheckAgainst } = config;

    if (valueDate < dateToCheckAgainst()) {
      return [ValidationError.make({ errorMsg, dataContext })];
    }
    return [];
  }
}

export default dateNotBefore;
