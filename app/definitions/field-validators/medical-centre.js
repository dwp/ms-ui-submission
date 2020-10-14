const { SimpleField, rules } = require('@dwp/govuk-casa/lib/Validation');
const validatePostalAddress = require('../../lib/validation-rules/postalAddress-validator.js');
const validatePhoneNumber = require('../../lib/validation-rules/phone-number-validator.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Medical centre validator');

module.exports = {
  name: SimpleField([
    rules.required.bind({
      errorMsg: 'medical-centre:name.errors.required',
    }),
  ]),
  phoneNumber: SimpleField([
    rules.required.bind({
      errorMsg: 'medical-centre:phoneNumber.errors.required',
    }),
    rules.strlen.bind({
      min: 11,
      errorMsgMin: 'medical-centre:phoneNumber.errors.badFormat',
      max: 20,
      errorMsgMax: 'medical-centre:phoneNumber.errors.badFormat',
    }),
    validatePhoneNumber.bind({
      errorMsg: 'medical-centre:phoneNumber.errors.badFormat',
    }),
  ]),
  address: SimpleField([
    validatePostalAddress.bind({
      errorMsgAddress1: 'medical-centre:address.address1.errors.required',
      errorMsgPostcodeFormat: 'medical-centre:postcode.errors.badFormat',
      altRegex: /^[^0-9]*$/,
    }),
  ]),
  doctor: SimpleField([
    rules.optional,
  ]),
};
