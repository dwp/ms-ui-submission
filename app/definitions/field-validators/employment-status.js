const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Employment status validator');

module.exports = {
  workTypes: SimpleField([
    rules.required.bind({
      errorMsg: 'employment-status:workTypes.errors.required',
    }),
  ]),
};
