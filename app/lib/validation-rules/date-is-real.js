/* eslint prefer-promise-reject-errors:0 radix:0 */

const moment = require('moment');

/**
 * dateIsReal - checks that the date is a real calendar date
 *          (e.g. day does not exceed valid number of days in a month,
 *                date does not contain any alphabetic characters or symbols)
 *
 * @param {object} value is a mandatory object containing the date being validated
 *          as dd, mm, and yyyy string properties of that object.
 *
 * @returns {Promise} resolved promise if real calendar date is found, rejected promise,
 *            with error message, not real
 * Bound attributes:
 *   string|object errorMsg - error message
 */
function dateIsReal(value) {
  const { dd, mm, yyyy } = value;
  const config = {
    errorMsg: 'validation:rule.dateObject.inline',
    errorMsgDigits: 'validation:rule.dateObject.inline',
    ...this,
  };

  const dayNum = dd.match(/^[0-9]{1,2}$/) !== null;
  const monNum = mm.match(/^[0-9]{1,2}$/) !== null;
  const yearNum = yyyy.match(/^[0-9]{4}$/) !== null && parseInt(yyyy) > 0;

  let validDate = dayNum && monNum && yearNum;

  if (validDate) {
    const valueDate = moment(`${yyyy}-${mm}-${dd}`, 'YYYY-MM-DD').startOf('day');
    validDate = (new Date(`${yyyy}-${mm}-${dd}`).toString() !== 'Invalid Date') && (valueDate.isValid());
  }

  return new Promise((resolve, reject) => {
    if (validDate) {
      resolve();
    } else if (!dayNum && monNum && yearNum) {
      reject({
        inline: config.errorMsgDigits,
        summary: config.errorMsgDigits,
        focusSuffix: ['[dd]'],
        errorType: ['day'],
      });
    } else if (dayNum && !monNum && yearNum) {
      reject({
        inline: config.errorMsgDigits,
        summary: config.errorMsgDigits,
        focusSuffix: ['[mm]'],
        errorType: ['month'],
      });
    } else if (dayNum && monNum && !yearNum) {
      reject({
        inline: config.errorMsgDigits,
        summary: config.errorMsgDigits,
        focusSuffix: ['[yyyy]'],
        errorType: ['year'],
      });
    } else if (!dayNum && !monNum && yearNum) {
      reject({
        inline: config.errorMsgDigits,
        summary: config.errorMsgDigits,
        focusSuffix: ['[dd]'],
        errorType: ['day', 'month'],
      });
    } else if (!dayNum && monNum && !yearNum) {
      reject({
        inline: config.errorMsgDigits,
        summary: config.errorMsgDigits,
        focusSuffix: ['[dd]'],
        errorType: ['day', 'year'],
      });
    } else if (dayNum && !monNum && !yearNum) {
      reject({
        inline: config.errorMsgDigits,
        summary: config.errorMsgDigits,
        focusSuffix: ['[mm]'],
        errorType: ['month', 'year'],
      });
    } else if (!dayNum && !monNum && !yearNum) {
      reject({
        inline: config.errorMsgDigits,
        summary: config.errorMsgDigits,
        focusSuffix: ['[dd]'],
        errorType: ['day', 'month', 'year'],
      });
    } else {
      reject({
        inline: config.errorMsg,
        summary: config.errorMsg,
        focusSuffix: ['[dd]'],
        errorType: ['day', 'month', 'year'],
      });
    }
  });
}

module.exports = dateIsReal;
