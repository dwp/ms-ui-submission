const Validation = require('@dwp/govuk-casa/lib/Validation');
const validatePhoneNumber = require('../../lib/validation-rules/phone-number-validator.js');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Mobile validator');

module.exports = {
  mobile: SimpleField([
    rules.required.bind({
      errorMsg: 'mobile:mobile.errors.required',
    }),
  ]),

  number: SimpleField([
    rules.required.bind({
      errorMsg: 'mobile:number.errors.required',
    }),
    validatePhoneNumber.bind({
      errorMsg: 'mobile:number.errors.badFormat',
    }),
    rules.strlen.bind({
      min: 11,
      errorMsgMin: 'mobile:number.errors.badFormat',
      max: 20,
      errorMsgMax: 'mobile:number.errors.badFormat',
    }),
  ], (pageData) => pageData.mobile === 'yes'),
};
