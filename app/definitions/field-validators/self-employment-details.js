const { SimpleField, rules } = require('@dwp/govuk-casa/lib/Validation');
const validatePostalAddress = require('../../lib/validation-rules/postalAddress-validator.js');
const phoneNumberRule = require('../../lib/validation-rules/phone-number-validator.js');

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
  employerTel: SimpleField([
    rules.required.bind({
      errorMsg: 'self-employment-details:employerTel.errors.required',
    }),
    phoneNumberRule.bind({
      errorMsg: 'self-employment-details:employerTel.errors.badFormat',
    }),
    rules.strlen.bind({
      min: 11,
      errorMsgMin: 'self-employment-details:employerTel.errors.badFormat',
      max: 20,
      errorMsgMax: 'self-employment-details:employerTel.errors.badFormat',
    }),
  ]),
  employerAddress: SimpleField([
    validatePostalAddress.bind({
      altRegex: /^[^0-9]*$/,
    }),
  ]),
};
