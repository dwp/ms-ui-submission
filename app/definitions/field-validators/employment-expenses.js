const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Employment expenses validator');

module.exports = {
  expenses: SimpleField([
    rules.required.bind({
      errorMsg: 'employment-expenses:expenses.errors.required',
    }),
  ]),
};
