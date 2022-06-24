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
  address: SimpleField([
    validatePostalAddress.bind({
      errorMsgAddress1: 'medical-centre:address.address1.errors.required',
      errorMsgAddress1Format: 'medical-centre:address.address1.errors.badFormat',
      errorMsgAddress2Format: 'medical-centre:address.address2.errors.badFormat',
      errorMsgPostcodeFormat: 'medical-centre:postcode.errors.badFormat',
      altRegex: /^[^0-9]*$/,
    }),
  ]),
  phoneNumber: SimpleField([
    rules.required.bind({
      errorMsg: 'medical-centre:phoneNumber.errors.required',
    }),
    validatePhoneNumber.bind({
      errorMsg: 'medical-centre:phoneNumber.errors.badFormat',
    }),
  ]),
  doctor: SimpleField([
    rules.optional,
  ]),
};
