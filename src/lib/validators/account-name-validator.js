/**
 * ValidateAccountName - checks account name correctly entered.
 *
 * @param {string} value Is a mandatory string containing the name of the account holder.
 * @returns {Promise} Resolved promise if account name is valid no consecutive spaces.
 * No consecutive special chars, no special char at start or end.
 * Bound attributes:
 *   string|object errorMsgConsecSpaces - consecutive spaces found
 *   string|object errorMsgConsecOther - consecutive special characters found
 *   string|object errorMsgStartAndEndFormat - special characters found at both the start and end
 *   string|object errorMsgStartFormat - special character found at start only
 *   string|object errorMsgSEndFormat - special character found at send only.
 */

import { ValidatorFactory, ValidationError } from '@dwp/govuk-casa';

class validateAccountName extends ValidatorFactory {
  validate(fieldValue, dataContext) {
    const config = {
      errorMsgConsecSpaces: { summary: 'bank-details:accountName.errors.consecSpaces' },
      errorMsgConsecOther: { summary: 'bank-details:accountName.errors.consecOther' },
      errorMsgStartAndEndFormat: { summary: 'bank-details:accountName.errors.startAndEndFormat' },
      errorMsgStartFormat: { summary: 'bank-details:accountName.errors.startFormat' },
      errorMsgEndFormat: { summary: 'bank-details:accountName.errors.endFormat' },
      ...this.config,
    };

    let { errorMsg } = config;

    const consecSpacesRegex = /[\s]{2,}/g;
    const consecOtherRegex = /[^A-Za-z0-9 ]{2,}/g;
    const startAndEndFormatRegex = /^(\s*[^A-Za-z0-9 ]).*([^A-Za-z0-9 ]\s*$)/;
    const startFormatRegex = /^\s*[^A-Za-z0-9 ]/;
    const endFormatRegex = /[^A-Za-z0-9 ]\s*$/;

    if (consecSpacesRegex.test(fieldValue)) {
      errorMsg = config.errorMsgConsecSpaces;
    } else if (consecOtherRegex.test(fieldValue)) {
      errorMsg = config.errorMsgConsecOther;
    } else if (startAndEndFormatRegex.test(fieldValue)) {
      errorMsg = config.errorMsgStartAndEndFormat;
    } else if (startFormatRegex.test(fieldValue)) {
      errorMsg = config.errorMsgStartFormat;
    } else if (endFormatRegex.test(fieldValue)) {
      errorMsg = config.errorMsgEndFormat;
    }

    return errorMsg === undefined ? [] : [ValidationError.make({ errorMsg, dataContext })];
  }
}

export default validateAccountName;
