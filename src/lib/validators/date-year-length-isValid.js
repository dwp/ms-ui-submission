/**
 * DateYearLengthIsValid - checks that the year is a valid length.

 * Bound attributes:
 *   string|object errorMsg - error message
 *   integer - length to validate against.
 */

import { ValidatorFactory, ValidationError } from '@dwp/govuk-casa';

class dateYearLengthIsValid extends ValidatorFactory {
  validate(fieldValue, dataContext) {
    const config = {
      errorMsg: {
        summary: 'validation:rule.dateObject.inline',
        focusSuffix: ['[yyyy]'],
      },
      yearLen: 4,
      ...this.config,
    };

    const { errorMsg } = config;
    const { yyyy } = fieldValue;

    if (yyyy && yyyy.length !== config.yearLen) {
      return [ValidationError.make({ errorMsg, dataContext })];
    }
    return [];
  }
}

export default dateYearLengthIsValid;
