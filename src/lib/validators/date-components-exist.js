/**
 * DateComponentsExist - checks that all three date elements have been entered for a date.

 * Bound attributes:
 *   string|object errorMsgDayMissing - day is missing
 *   string|object errorMsgMonthMissing - month is missing
 *   string|object errorMsgYearMissing - year is missing
 *   string|object errorMsgDayAndMonthMissing - day and month are missing
 *   string|object errorMsgDayAndYearMissing - day and year are missing
 *   string|object errorMsgMonthAndYearMissing - month and year are missing.
 */
import { ValidatorFactory, ValidationError } from '@dwp/govuk-casa';

class dateComponentsExist extends ValidatorFactory {
  validate(fieldValue, dataContext) {
    const config = {
      errorMsgDayMissing: { summary: 'validation:rule.dateObject.inline' },
      errorMsgMonthMissing: { summary: 'validation:rule.dateObject.inline' },
      errorMsgYearMissing: { summary: 'validation:rule.dateObject.inline' },
      errorMsgDayAndMonthMissing: { summary: 'validation:rule.dateObject.inline' },
      errorMsgDayAndYearMissing: { summary: 'validation:rule.dateObject.inline' },
      errorMsgMonthAndYearMissing: { summary: 'validation:rule.dateObject.inline' },
      ...this.config,
    };

    let { errorMsg } = config;
    let valid = true;
    const { dd, mm, yyyy } = fieldValue;

    if (!dd && mm && yyyy) {
      valid = false;
      errorMsg = config.errorMsgDayMissing;
    }
    else if (dd && !mm && yyyy) {
      valid = false;
      errorMsg = config.errorMsgMonthMissing;
    } else if (dd && mm && !yyyy) {
      valid = false;
      errorMsg = config.errorMsgYearMissing;
    } else if (!dd && !mm && yyyy) {
      valid = false;
      errorMsg = config.errorMsgDayAndMonthMissing;
    } else if (!dd && mm && !yyyy) {
      valid = false;
      errorMsg = config.errorMsgDayAndYearMissing;
    } else if (dd && !mm && !yyyy) {
      valid = false;
      errorMsg = config.errorMsgMonthAndYearMissing;
    }

    return valid ? [] : [ValidationError.make({ errorMsg, dataContext })];
  }
}

export default dateComponentsExist;
