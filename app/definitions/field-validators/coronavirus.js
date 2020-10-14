const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Coronavirus validator');

module.exports = {
  coronavirusReasonForClaim: SimpleField([
    rules.required.bind({
      errorMsg: 'coronavirus:coronavirusReasonForClaim.errors.required',
    }),
  ]),
};
