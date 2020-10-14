const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Pension deductions validator');

module.exports = {
  deductions: SimpleField([
    rules.required.bind({
      errorMsg: 'pension-deductions:deductions.errors.required',
    }),
    rules.inArray.bind({
      source: ['yes', 'no', 'notsure'],
      errorMsg: 'pension-deductions:deductions.errors.required',
    }),
  ]),
};
