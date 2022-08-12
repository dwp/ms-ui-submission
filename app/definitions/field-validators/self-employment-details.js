const { SimpleField, rules } = require('@dwp/govuk-casa/lib/Validation');
const validatePostalAddress = require('../../lib/validation-rules/postalAddress-validator.js');
const validatePhoneNumber = require('../../lib/validation-rules/phone-number-validator.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Self employment details validator');

module.exports = {
  jobTitle: SimpleField([
    rules.required.bind({
      errorMsg: 'self-employment-details:jobTitle.errors.required',
    }),
  ]),
  employerName: SimpleField([
    rules.required.bind({
      errorMsg: 'self-employment-details:employerName.errors.required',
    }),
  ]),
  employerAddress: SimpleField([
    validatePostalAddress.bind({
      errorMsgAddress1: 'self-employment-details:employerAddress.address1.errors.required',
      errorMsgAddress1Format: 'self-employment-details:employerAddress.address1.errors.badFormat',
      errorMsgAddress2Format: 'self-employment-details:employerAddress.address2.errors.badFormat',
      errorMsgPostcodeFormat: 'self-employment-details:postcode.errors.badFormat',
      altRegex: /^[^0-9]*$/,
    }),
  ]),
  employerTel: SimpleField([
    rules.required.bind({
      errorMsg: 'self-employment-details:employerTel.errors.required',
    }),
    validatePhoneNumber.bind({
      errorMsg: 'self-employment-details:employerTel.errors.badFormat',
    }),
  ]),
};
