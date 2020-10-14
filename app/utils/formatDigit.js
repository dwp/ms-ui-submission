/**
 * Format single digit days or months to have a leading zero
 *
 * @param {mixed} digit number to check
 * @return {string} the formatted digit
 */
module.exports = (digit) => (String(digit).length > 1 ? String(digit) : `0${digit}`);
