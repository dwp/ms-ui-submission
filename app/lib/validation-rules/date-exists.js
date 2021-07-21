/**
 * dateExists - checks that all three date elements have been entered for a date
 *
 * @param {object} value is a mandatory object containing the date being validated
 *          as dd, mm, and yyyy string properties of that object.
 *
 * @returns {Promise} resolved promise if any component is present, rejected promise,
 *          with error message, if all components are missing
 * Bound attributes:
 *   string|object errorMsg - error message
 */
function dateExists(value) {
  const config = {
    errorMsg: 'validation:rule.dateObject.inline',
    ...this,
  };
  const trimmedValue = value;
  trimmedValue.dd = value.dd.replace(/\s/g, '');
  trimmedValue.mm = value.mm.replace(/\s/g, '');
  trimmedValue.yyyy = value.yyyy.replace(/\s/g, '');
  const { dd, mm, yyyy } = trimmedValue;

  return new Promise((resolve, reject) => {
    if (!dd && !mm && !yyyy) {
      /* eslint-disable-next-line prefer-promise-reject-errors */
      reject({
        inline: config.errorMsg,
        summary: config.errorMsg,
        focusSuffix: ['[dd]'],
      });
    } else {
      resolve();
    }
  });
}

module.exports = dateExists;
