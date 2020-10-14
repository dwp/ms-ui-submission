const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Insurance premiums validator');

module.exports = {
  premiums: SimpleField([
    rules.required.bind({
      errorMsg: 'insurance-premiums:premiums.errors.required',
    }),
    rules.inArray.bind({
      source: ['yes', 'no', 'notsure'],
      errorMsg: 'insurance-premiums:premiums.errors.required',
    }),
  ]),
};
