const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Military overseas validator');

module.exports = {
  militaryOverseas: SimpleField([
    rules.required.bind({
      errorMsg: 'military-overseas:errors.required',
    }),
    rules.inArray.bind({
      source: ['yes', 'no'],
      errorMsg: 'military-overseas:errors.required',
    }),
  ]),
};
