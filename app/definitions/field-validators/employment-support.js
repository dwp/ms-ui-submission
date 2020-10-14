const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Employment support validator');

module.exports = {
  support: SimpleField([
    rules.required.bind({
      errorMsg: 'employment-support:support.errors.required',
    }),
    rules.inArray.bind({
      source: ['yes', 'no', 'notSure'],
      errorMsg: 'employment-support:support.errors.required',
    }),
  ]),
};
