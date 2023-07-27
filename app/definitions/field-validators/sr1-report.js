const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('sr1 report validator');

module.exports = {
  sr1Report: SimpleField([
    rules.required.bind({
      errorMsg: 'sr1-report:sr1Report.errors.required',
    }),
    rules.inArray.bind({
      source: ['yes', 'no', 'dontKnow'],
      errorMsg: 'sr1-report:sr1Report.errors.required',
    }),
  ]),
};
