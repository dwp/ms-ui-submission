const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Insurance validator');

module.exports = {
  insurance: SimpleField([
    rules.required.bind({
      errorMsg: 'insurance:insurance.errors.required',
    }),
    rules.inArray.bind({
      source: ['yes', 'no', 'notsure'],
      errorMsg: 'insurance:insurance.errors.required',
    }),
  ], (pageData) => pageData.screen === 'insurance'),

  other: SimpleField([
    rules.required.bind({
      errorMsg: 'insurance:other.errors.required',
    }),
  ], (pageData) => pageData.screen === 'insurance-other'),

  screen: SimpleField([
    rules.inArray.bind({
      source: ['insurance', 'insurance-other'],
    }),
  ]),
};
