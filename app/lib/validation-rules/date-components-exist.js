/**
 * dateComponentsExist - checks that all three date elements have been entered for a date
 *
 * @param {object} value is a mandatory object containing the date being validated
 *          as dd, mm, and yyyy string properties of that object.
 *
 * @returns {Promise} resolved promise if all components are present, rejected promise,
 * Bound attributes:
 *   string|object errorMsgDayMissing - day is missing
 *   string|object errorMsgMonthMissing - month is missing
 *   string|object errorMsgYearMissing - year is missing
 *   string|object errorMsgDayAndMonthMissing - day and month are missing
 *   string|object errorMsgDayAndYearMissing - day and year are missing
 *   string|object errorMsgMonthAndYearMissing - month and year are missing
 *
 */
function dateComponentsExist(value) {
  const config = {
    errorMsgDayMissing: 'validation:rule.dateObject.inline',
    errorMsgMonthMissing: 'validation:rule.dateObject.inline',
    errorMsgYearMissing: 'validation:rule.dateObject.inline',
    errorMsgDayAndMonthMissing: 'validation:rule.dateObject.inline',
    errorMsgDayAndYearMissing: 'validation:rule.dateObject.inline',
    errorMsgMonthAndYearMissing: 'validation:rule.dateObject.inline',
    ...this,
  };
  const { dd, mm, yyyy } = value;
  return new Promise((resolve, reject) => {
    if (!dd && mm && yyyy) {
      /* eslint-disable-next-line prefer-promise-reject-errors */
      reject({
        inline: config.errorMsgDayMissing,
        summary: config.errorMsgDayMissing,
        focusSuffix: ['[dd]'],
      });
    } else if (dd && !mm && yyyy) {
      /* eslint-disable-next-line prefer-promise-reject-errors */
      reject({
        inline: config.errorMsgMonthMissing,
        summary: config.errorMsgMonthMissing,
        focusSuffix: ['[mm]'],
      });
    } else if (dd && mm && !yyyy) {
      /* eslint-disable-next-line prefer-promise-reject-errors */
      reject({
        inline: config.errorMsgYearMissing,
        summary: config.errorMsgYearMissing,
        focusSuffix: ['[yyyy]'],
      });
    } else if (!dd && !mm && yyyy) {
      /* eslint-disable-next-line prefer-promise-reject-errors */
      reject({
        inline: config.errorMsgDayAndMonthMissing,
        summary: config.errorMsgDayAndMonthMissing,
        focusSuffix: ['[dd]'],
      });
    } else if (!dd && mm && !yyyy) {
      /* eslint-disable-next-line prefer-promise-reject-errors */
      reject({
        inline: config.errorMsgDayAndYearMissing,
        summary: config.errorMsgDayAndYearMissing,
        focusSuffix: ['[dd]'],
      });
    } else if (dd && !mm && !yyyy) {
      /* eslint-disable-next-line prefer-promise-reject-errors */
      reject({
        inline: config.errorMsgMonthAndYearMissing,
        summary: config.errorMsgMonthAndYearMissing,
        focusSuffix: ['[mm]'],
      });
    } else {
      resolve();
    }
  });
}

module.exports = dateComponentsExist;
