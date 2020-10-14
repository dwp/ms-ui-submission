const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('disability-or-health-condition for claim validator');

module.exports = {
  disabilityOrHealthCondition: SimpleField([
    rules.required.bind({
      errorMsg: 'disability-or-health-condition:error',
    }),
  ]),
};
