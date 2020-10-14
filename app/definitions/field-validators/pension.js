const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Pension validator');

module.exports = {
  pension: SimpleField([
    rules.inArray.bind({
      source: ['yes', 'no', 'notsure'],
      errorMsg: 'pension:pension.errors.required',
    }),
    rules.required.bind({
      errorMsg: 'pension:pension.errors.required',
    }),
  ], (pageData) => pageData.screen === 'pension'),

  other: SimpleField([
    rules.required.bind({
      errorMsg: 'pension:other.errors.required',
    }),
  ], (pageData) => pageData.screen === 'pension-other'),

  screen: SimpleField([
    rules.inArray.bind({
      source: ['pension', 'pension-other'],
    }),
  ]),
};
