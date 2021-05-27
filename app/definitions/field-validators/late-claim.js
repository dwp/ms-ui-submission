const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Late claim validator');

module.exports = {
  lateClaim: SimpleField([
    rules.required.bind({
      errorMsg: 'late-claim:lateClaim.errors.required',
    }),
  ]),
};
