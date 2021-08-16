const { SimpleField, rules } = require('@dwp/govuk-casa/lib/Validation');
const validatePostalAddress = require('../../lib/validation-rules/postalAddress-validator.js');
const validatePhoneNumber = require('../../lib/validation-rules/phone-number-validator.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Employment details validator');

module.exports = {
  jobTitle: SimpleField([
    rules.required.bind({
      errorMsg: 'employment-details:jobTitle.errors.required',
    }),
  ]),
  employerName: SimpleField([
    rules.required.bind({
      errorMsg: 'employment-details:employerName.errors.required',
    }),
  ]),
  employerTel: SimpleField([
    rules.required.bind({
      errorMsg: 'employment-details:employerTel.errors.required',
    }),
    validatePhoneNumber.bind({
      errorMsg: 'employment-details:employerTel.errors.badFormat',
    }),
  ]),
  employerAddress: SimpleField([
    validatePostalAddress.bind({
      altRegex: /^[^0-9]*$/,
    }),
  ]),
};
