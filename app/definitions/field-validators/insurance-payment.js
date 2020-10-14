const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Insurance payment validator');

module.exports = {
  frequency: SimpleField([
    rules.optional,
  ]),

  amount: SimpleField([
    rules.regex.bind({
      errorMsg: 'insurance-payment:amount.errors.notNum',
      pattern: /^[0-9.]*$/,
    }),
    rules.regex.bind({
      errorMsg: 'insurance-payment:amount.errors.badFormat',
      pattern: /^[0-9]{1,}(\.[0-9]{1,2})?$/,
    }),
    rules.optional,
  ]),
};
