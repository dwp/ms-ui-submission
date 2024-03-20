/**
 * ValidateAccountName - checks account name correctly entered.
 *
 * @param {string} value Is a mandatory string containing the name of the account holder.
 * @returns {Promise} Resolved promise if account name is valid (no consecutive spaces,
 * no consecutive special chars, no special char at start or end.
 * Bound attributes:
 *   string|object errorMsgConsecSpaces - consecutive spaces found
 *   string|object errorMsgConsecOther - consecutive special characters found
 *   string|object errorMsgStartAndEndFormat - special characters found at both the start and end
 *   string|object errorMsgStartFormat - special character found at start only
 *   string|object errorMsgSEndFormat - special character found at send only.
 */
function validateAccountName(value) {
  const config = {
    errorMsgConsecSpaces: 'bank-details:accountName.errors.consecSpaces',
    errorMsgConsecOther: 'bank-details:accountName.errors.consecOther',
    errorMsgStartAndEndFormat: 'bank-details:accountName.errors.startAndEndFormat',
    errorMsgStartFormat: 'bank-details:accountName.errors.startFormat',
    errorMsgEndFormat: 'bank-details:accountName.errors.endFormat',
    ...this,
  };
  const consecSpacesRegex = /[\s]{2,}/g;
  const consecOtherRegex = /[^A-Za-z0-9 ]{2,}/g;
  const startAndEndFormatRegex = /^(\s*[^A-Za-z0-9 ]).*([^A-Za-z0-9 ]\s*$)/;
  const startFormatRegex = /^\s*[^A-Za-z0-9 ]/;
  const endFormatRegex = /[^A-Za-z0-9 ]\s*$/;
  return new Promise((resolve, reject) => {
    if (consecSpacesRegex.test(value)) {
      reject(config.errorMsgConsecSpaces);
    } else if (consecOtherRegex.test(value)) {
      reject(config.errorMsgConsecOther);
    } else if (startAndEndFormatRegex.test(value)) {
      reject(config.errorMsgStartAndEndFormat);
    } else if (startFormatRegex.test(value)) {
      reject(config.errorMsgStartFormat);
    } else if (endFormatRegex.test(value)) {
      reject(config.errorMsgEndFormat);
    } else {
      resolve();
    }
  });
}

export default validateAccountName;
