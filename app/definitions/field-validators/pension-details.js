const { SimpleField, rules } = require('@dwp/govuk-casa/lib/Validation');
const validatePostalAddress = require('../../lib/validation-rules/postalAddress-validator.js');
const phoneNumberRule = require('../../lib/validation-rules/phone-number-validator.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Pension details validator');

module.exports = {
  providerTel: SimpleField([
    phoneNumberRule.bind({
      errorMsg: 'pension-details:providerTel.errors.badFormat',
    }),
    rules.strlen.bind({
      min: 11,
      errorMsgMin: 'pension-details:providerTel.errors.badFormat',
      max: 20,
      errorMsgMax: 'pension-details:providerTel.errors.badFormat',
    }),
    rules.optional,
  ]),
  providerAddress: SimpleField([
    validatePostalAddress.bind({
      requiredFields: [],
      errorMsgAddress1: 'pension-details:providerAddress.address1.errors.required',
      errorMsgPostcode: 'pension-details:providerAddress.postcode.errors.required',
      altRegex: /^[^0-9]*$/,
    }),
  ]),
  providerRef: SimpleField([
    rules.optional,
  ]),
  pensionProvider: SimpleField([
    rules.optional,
  ]),
};
