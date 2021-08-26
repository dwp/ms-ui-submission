/**
 * required
 */
const { validateEmail: validateEmailUtil } = require('../../../app/utils/email-validator.js');

/**
 * Test if email is valid.
 *
 * @param  {string} fieldValue Email to test
 * @return {Promise} Promise which is rejected with bound error object or default error object
 */

function validateEmail(fieldValue) {
  return new Promise((resolve, reject) => {
    if (validateEmailUtil(fieldValue)) {
      resolve();
    } else {
      reject(this.errorMsg || {
        inline: 'validation:rule.required.inline',
        summary: 'validation:rule.required.summary',
      });
    }
  });
}

exports.validateEmail = validateEmail;
