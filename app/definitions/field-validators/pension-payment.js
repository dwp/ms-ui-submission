const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const afterDeductionsCheck = require('../../lib/validation-rules/payment-amounts-validator.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Pension payment validator');

module.exports = {
  amount: SimpleField([
    rules.regex.bind({
      errorMsg: 'pension-payment:amount.errors.notNum',
      pattern: /^[0-9.]*$/,
    }),
    rules.regex.bind({
      errorMsg: 'pension-payment:amount.errors.badFormat',
      pattern: /^[0-9]{1,5}(\.[0-9]{1,2})?$/,
    }),
    rules.optional,
  ], (pageData) => typeof pageData.amountBeforeDeductions === 'undefined'),

  amountBeforeDeductions: SimpleField([
    rules.regex.bind({
      errorMsg: 'pension-payment:amountBeforeDeductions.errors.notNum',
      pattern: /^[0-9.]*$/,
    }),
    rules.regex.bind({
      errorMsg: 'pension-payment:amountBeforeDeductions.errors.badFormat',
      pattern: /^[0-9]{1,5}(\.[0-9]{1,2})?$/,
    }),
    rules.optional,
  ], (pageData) => typeof pageData.amount === 'undefined'),

  amountAfterDeductions: SimpleField([
    rules.regex.bind({
      errorMsg: 'pension-payment:amountAfterDeductions.errors.notNum',
      pattern: /^[0-9.]*$/,
    }),
    rules.regex.bind({
      errorMsg: 'pension-payment:amountAfterDeductions.errors.badFormat',
      pattern: /^[0-9]{1,5}(\.[0-9]{1,2})?$/,
    }),
    afterDeductionsCheck.bind({
      errorMsg: 'pension-payment:amountAfterDeductions.errors.notLessThan',
    }),
    rules.optional,
  ], (pageData) => typeof pageData.amount === 'undefined'),
};
