/**
 * DateIsReal - Checks that the date is a real calendar date.
 *          (e.g. Day does not exceed valid number of days in a month,
 *                date does not contain any alphabetic characters or symbols).
 *
 * Bound attributes:
 *   string|object errorMsg - error message.
 */
import { DateTime } from 'luxon';
import { ValidatorFactory, ValidationError } from '@dwp/govuk-casa';

class dateIsReal extends ValidatorFactory {
  validate(fieldValue, dataContext) {
    const config = {
      errorMsg: { summary: 'validation:rule.dateObject.inline' },
      errorMsgDigits: { summary: 'validation:rule.dateObject.inline' },
      ...this.config,
    };

    let { errorMsg } = config;
    let { dd, mm } = fieldValue;
    const { yyyy } = fieldValue;

    const dayNum = dd.match(/^[0-9]{1,2}$/) !== null && parseInt(dd) > 0;
    const monNum = mm.match(/^[0-9]{1,2}$/) !== null && parseInt(mm) > 0;
    const yearNum = yyyy.match(/^[0-9]{2,4}$/) !== null && parseInt(yyyy) > 0;

    // Make day and month two digits
    dd = (`0${dd}`).slice(-2);
    mm = (`0${mm}`).slice(-2);

    let validDate = dayNum && monNum && yearNum;

    if (validDate) {
      const valueDate = DateTime.fromISO(`${yyyy}-${mm}-${dd}`).startOf('day');
      validDate = (new Date(`${yyyy}-${mm}-${dd}`).toString() !== 'Invalid Date') && (valueDate.isValid);
    }

    if (!dayNum && monNum && yearNum) {
      errorMsg = config.errorMsgDigits;
      errorMsg = {
        inline: config.errorMsgDigits.summary,
        summary: config.errorMsgDigits.summary,
        focusSuffix: ['[dd]'],
        errorType: ['day'],
      };
    } else if (dayNum && !monNum && yearNum) {
      errorMsg = {
        inline: config.errorMsgDigits.summary,
        summary: config.errorMsgDigits.summary,
        focusSuffix: ['[mm]'],
        errorType: ['month'],
      };
    } else if (dayNum && monNum && !yearNum) {
      errorMsg = {
        inline: config.errorMsgDigits.summary,
        summary: config.errorMsgDigits.summary,
        focusSuffix: ['[yyyy]'],
        errorType: ['year'],
      };
    } else if (!dayNum && !monNum && yearNum) {
      errorMsg = {
        inline: config.errorMsgDigits.summary,
        summary: config.errorMsgDigits.summary,
        focusSuffix: ['[dd]'],
        errorType: ['day', 'month'],
      };
    } else if (!dayNum && monNum && !yearNum) {
      errorMsg = {
        inline: config.errorMsgDigits.summary,
        summary: config.errorMsgDigits.summary,
        focusSuffix: ['[dd]'],
        errorType: ['day', 'year'],
      };
    } else if (dayNum && !monNum && !yearNum) {
      errorMsg = {
        inline: config.errorMsgDigits.summary,
        summary: config.errorMsgDigits.summary,
        focusSuffix: ['[mm]'],
        errorType: ['month', 'year'],
      };
    } else if (!dayNum && !monNum && !yearNum) {
      errorMsg = {
        inline: config.errorMsgDigits.summary,
        summary: config.errorMsgDigits.summary,
        focusSuffix: ['[dd]'],
        errorType: ['day', 'month', 'year'],
      };
    } else {
      errorMsg = {
        inline: config.errorMsgDigits.summary,
        summary: config.errorMsgDigits.summary,
        focusSuffix: ['[dd]'],
        errorType: ['day', 'month', 'year'],
      };
    }
    return validDate ? [] : [ValidationError.make({ errorMsg, dataContext })];
  }
}

export default dateIsReal;
