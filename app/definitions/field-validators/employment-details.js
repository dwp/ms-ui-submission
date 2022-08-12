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
  employerAddress: SimpleField([
    validatePostalAddress.bind({
      errorMsgAddress1: 'employment-details:employerAddress.address1.errors.required',
      errorMsgAddress1Format: 'employment-details:employerAddress.address1.errors.badFormat',
      errorMsgAddress2Format: 'employment-details:employerAddress.address2.errors.badFormat',
      errorMsgPostcodeFormat: 'employment-details:postcode.errors.badFormat',
      altRegex: /^[^0-9]*$/,
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
};
