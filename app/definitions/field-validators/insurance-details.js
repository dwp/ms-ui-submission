const { SimpleField, rules } = require('@dwp/govuk-casa/lib/Validation');
const validatePostalAddress = require('../../lib/validation-rules/postalAddress-validator.js');
const phoneNumberRule = require('../../lib/validation-rules/phone-number-validator.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Insurance details validator');

module.exports = {
  insuranceProvider: SimpleField([
    rules.optional,
  ]),
  providerTel: SimpleField([
    phoneNumberRule.bind({
      errorMsg: 'insurance-details:providerTel.errors.badFormat',
    }),
    rules.strlen.bind({
      min: 11,
      errorMsgMin: 'insurance-details:providerTel.errors.badFormat',
      max: 20,
      errorMsgMax: 'insurance-details:providerTel.errors.badFormat',
    }),
    rules.optional,
  ]),
  providerAddress: SimpleField([
    validatePostalAddress.bind({
      requiredFields: [],
      errorMsgAddress1: 'insurance-details:providerAddress.address1.errors.required',
      errorMsgPostcode: 'insurance-details:providerAddress.postcode.errors.required',
      altRegex: /^[^0-9]*$/,
    }),
  ]),
  providerRef: SimpleField([
    rules.optional,
  ]),
};
