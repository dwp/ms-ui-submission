const Validation = require('@dwp/govuk-casa/lib/Validation');
const validatePhoneNumber = require('../../lib/validation-rules/phone-number-validator.js');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Other number validator');

module.exports = {
  other: SimpleField([
    rules.required.bind({
      errorMsg: 'other-number:other.errors.required',
    }),
  ]),

  number: SimpleField([
    rules.required.bind({
      errorMsg: 'other-number:number.errors.required',
    }),
    validatePhoneNumber.bind({
      errorMsg: 'other-number:number.errors.badFormat',
    }),
    rules.strlen.bind({
      min: 11,
      errorMsgMin: 'other-number:number.errors.badFormat',
      max: 20,
      errorMsgMax: 'other-number:number.errors.badFormat',
    }),
  ], (pageData) => pageData.other === 'yes'),
};
