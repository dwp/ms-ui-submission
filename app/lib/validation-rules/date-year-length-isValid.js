/**
 * dateYearLengthIsValid - checks that the year is a valid length
 *
 * @param {object} value is a mandatory object containing the date being validated
 *          as dd, mm, and yyyy string properties of that object.
 *
 * @returns {Promise} resolved promise if year is of valid length, rejected promise,
 *            with error message, if not valid
 * Bound attributes:
 *   string|object errorMsg - error message
 *   integer - length to validate against
 */
function dateYearLengthIsValid(value) {
  const config = {
    errorMsg: 'validation:rule.dateObject.inline',
    yearLen: 4,
    ...this,
  };
  const { yyyy } = value;
  return new Promise((resolve, reject) => {
    if (yyyy && yyyy.length !== config.yearLen) {
      /* eslint-disable-next-line prefer-promise-reject-errors */
      reject({
        inline: config.errorMsg,
        summary: config.errorMsg,
        focusSuffix: ['[yyyy]'],
      });
    } else {
      resolve();
    }
  });
}

module.exports = dateYearLengthIsValid;
