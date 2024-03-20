/**
 * Format single digit days or months to have a leading zero.
 *
 * @param {mixed} digit Number to check.
 * @returns {string} The formatted digit.
 */
export default (digit) => (String(digit).length > 1 ? String(digit) : `0${digit}`);
