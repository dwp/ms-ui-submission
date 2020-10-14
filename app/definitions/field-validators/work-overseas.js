const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Work overseas validator');

module.exports = {
  workOverseas: SimpleField([
    rules.required.bind({
      errorMsg: 'work-overseas:errors.required',
    }),
    rules.inArray.bind({
      source: ['yes', 'no'],
      errorMsg: 'work-overseas:errors.required',
    }),
  ]),
};
