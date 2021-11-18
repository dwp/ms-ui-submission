const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('who-is-applying validator');

module.exports = {
  whoIsApplying: SimpleField([
    rules.required.bind({
      errorMsg: 'who-is-applying:error',
    }),
  ]),
};
