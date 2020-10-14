const { SimpleField, ArrayObjectField, rules } = require('@dwp/govuk-casa/lib/Validation');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Pension deductions details validator');

const deduction = {
  amount: SimpleField([
    rules.regex.bind({
      errorMsg: 'pension-deductions-details:amount.errors.notNum',
      pattern: /^[0-9.]*$/,
    }),
    rules.regex.bind({
      errorMsg: 'pension-deductions-details:amount.errors.badFormat',
      pattern: /^[0-9]{1,5}(\.[0-9]{1,2})?$/,
    }),
    rules.optional,
  ], (pageData, fieldName) => {
    const index = fieldName.match(/\[(\d{1,2})\]/)[1];
    const { amount, detail } = pageData.deductionsDetails[index];
    return index === '0' ? true : (amount || detail);
  }),

  detail: SimpleField([
  ], (pageData, fieldName) => {
    const index = fieldName.match(/\[(\d{1,2})\]/)[1];
    const { amount, detail } = pageData.deductionsDetails[index];
    return index === '0' ? true : (amount || detail);
  }),
};

module.exports = {
  deductionsDetails: ArrayObjectField(deduction),
};
