const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Pension inherit validator');

module.exports = {
  pensionInherit: SimpleField([
    rules.inArray.bind({
      source: ['yes', 'no', 'notsure'],
      errorMsg: 'pension-inherit:pensionInherit.errors.required',
    }),
    rules.required.bind({
      errorMsg: 'pension-inherit:pensionInherit.errors.required',
    }),
  ]),
};
