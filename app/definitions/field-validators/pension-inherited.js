const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Pension inherited validator');

module.exports = {
  inherited: SimpleField([
    rules.required.bind({
      errorMsg: 'pension-inherited:inherited.errors.required',
    }),
    rules.inArray.bind({
      source: ['yes', 'no'],
      errorMsg: 'pension-inherited:inherited.errors.required',
    }),
    rules.optional,
  ]),
};
