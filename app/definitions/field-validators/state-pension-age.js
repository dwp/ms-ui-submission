const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('state-pension-age validator');

module.exports = {
  statePensionAge: SimpleField([
    rules.required.bind({
      errorMsg: 'state-pension-age:error',
    }),
  ]),
};
