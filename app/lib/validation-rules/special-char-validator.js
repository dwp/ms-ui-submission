/**
 * validateSpecialChar - checks field value does not contain < > /
 *
 * @param {string} value is a mandatory string containing the value of field
 *
 * @returns {Promise} resolved promise if bank name is valid
 * (no special character like <, > or / anywhere)
 * Bound attributes:
 *   string|object errorMsg - special character <,> or / found anywhere
 *
 */
function validateSpecialChar(value) {
  const config = {
    specialChars: ['<', '>', '/'],
    ...this,
  };
  return new Promise((resolve, reject) => {
    if (config.specialChars.some((char) => value.includes(char))) {
      reject(config.errorMsg);
    } else {
      resolve();
    }
  });
}

module.exports = validateSpecialChar;
