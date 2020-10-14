const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Employment expenses validator');

module.exports = {
  expensesDetails: SimpleField([
    rules.required.bind({
      errorMsg: 'employment-expenses-details:expensesDetails.errors.required',
    }),
    rules.strlen.bind({
      max: 10000,
      errorMsgMax: 'employment-expenses-details:expensesDetails.errors.maxLength',
    }),
  ]),
};
