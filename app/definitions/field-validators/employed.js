const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Employed validator');
module.exports = {
  employed: SimpleField([
    rules.required.bind({
      errorMsg: 'employed:employed.errors.required',
    }),
    rules.inArray.bind({
      source: ['yes', 'no'],
      errorMsg: 'employed:employed.errors.required',
    }),
  ], (pageData) => pageData.screen === 'employed'),

  other: SimpleField([
    rules.required.bind({
      errorMsg: 'employed:other.errors.required',
    }),
    rules.inArray.bind({
      source: ['yes', 'no'],
      errorMsg: 'employed:other.errors.required',
    }),
  ], (pageData) => pageData.screen === 'employed-other'),

  screen: SimpleField([
    rules.inArray.bind({
      source: ['employed', 'employed-other'],
    }),
  ]),
};
