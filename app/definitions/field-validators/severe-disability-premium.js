const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('severe-disability-premium validator');

module.exports = {
  severeDisabilityPremium: SimpleField([
    rules.required.bind({
      errorMsg: 'severe-disability-premium:error',
    }),
  ]),
};
