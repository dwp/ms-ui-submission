const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Another health condition validator');
module.exports = {
  anotherCondition: SimpleField([
    rules.required.bind({
      errorMsg: 'another-health-condition:condition.errors.required',
    }),
    rules.inArray.bind({
      source: ['yes', 'no'],
      errorMsg: 'another-health-condition:condition.errors.required',
    }),
  ], (pageData) => pageData.limitReached === 'no'),
  limitReached: SimpleField([
    rules.inArray.bind({
      source: ['yes', 'no'],
    }),
  ]),
};
