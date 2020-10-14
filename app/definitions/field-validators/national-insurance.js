const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('national-insurance validator');

module.exports = {
  nationalInsurance: SimpleField([
    rules.required.bind({
      errorMsg: 'national-insurance:error',
    }),
  ]),
};
