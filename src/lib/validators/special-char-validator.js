/**
 * ValidateSpecialChar - checks field value does not contain < > /.
 *
 * @param {string} value Is a mandatory string containing the value of field.
 * @returns {Promise} Resolved promise if bank name is valid.
 * (no special character like <, > or / anywhere).
 * Bound attributes:
 *   string|object errorMsg - special character <,> or / found anywhere.
 */
import { ValidatorFactory, ValidationError } from '@dwp/govuk-casa';

class validateSpecialChar extends ValidatorFactory {
  validate(fieldValue, dataContext) {
    const config = {
      specialChars: ['<', '>', '/'],
      ...this.config,
    };

    const { errorMsg, minStrLength = 1, required = true } = config;

    if (fieldValue === undefined || fieldValue === '') {
      return [];
    }

    if (config.specialChars.some((char) => fieldValue.includes(char))
      || (fieldValue.trim().length <= minStrLength && required === true)) {
      return [ValidationError.make({ errorMsg, dataContext })];
    }

    return [];
  }
}

export default validateSpecialChar;
