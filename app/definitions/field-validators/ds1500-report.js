const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('ds1500 report validator');

module.exports = {
  ds1500Report: SimpleField([
    rules.required.bind({
      errorMsg: 'ds1500-report:ds1500Report.errors.required',
    }),
    rules.inArray.bind({
      source: ['yes', 'no', 'dontKnow'],
      errorMsg: 'ds1500-report:ds1500Report.errors.required',
    }),
  ]),
};
