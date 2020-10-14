const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Employment off sick validator');

module.exports = {
  offSick: SimpleField([
    rules.required.bind({
      errorMsg: 'employment-off-sick:offSick.errors.required',
    }),
    rules.inArray.bind({
      source: ['yes', 'no'],
      errorMsg: 'employment-off-sick:offSick.errors.required',
    }),
  ]),
};
