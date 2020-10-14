const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Employment pay frequency (other) validator');

module.exports = {
  frequency: SimpleField([
    rules.required.bind({
      errorMsg: 'employment-pay-frequency-other:frequency.errors.required',
    }),
  ]),

  netPay: SimpleField([
    rules.required.bind({
      errorMsg: 'employment-pay-frequency-other:netPay.errors.required',
    }),
    rules.regex.bind({
      errorMsg: 'employment-pay-frequency-other:netPay.errors.notNum',
      pattern: /^[0-9.]*$/,
    }),
    rules.regex.bind({
      errorMsg: 'employment-pay-frequency-other:netPay.errors.badFormat',
      pattern: /^[0-9]{1,}(\.[0-9]{1,2})?$/,
    }),
  ]),
};
