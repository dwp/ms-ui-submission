import { ValidatorFactory, ValidationError } from '@dwp/govuk-casa';
import { DateTime } from 'luxon';

class dateNotAfter extends ValidatorFactory {
  name = 'dateNotAfter';

  sanitise(value) {
    const { dd, mm, yyyy } = value;
    if (dd !== null && mm !== null && yyyy !== null) {
      return value;
    }
    return undefined;
  }

  validate(fieldValue, dataContext) {
    const today = () => DateTime.now().startOf('day');
    const config = {
      errorMsg: 'validation:rule.dateObject.inline',
      dateToCheckAgainst: today,
      ...this.config,
    };

    const { errorMsg, dateToCheckAgainst } = config;

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

    if ((valueDate > dateToCheckAgainst()) || !validDate) {
      return [ValidationError.make({ errorMsg, dataContext })];
    }
    return [];
  }
}

export default dateNotAfter;
