const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Severe condition validator');

module.exports = {
  severeCondition: SimpleField([
    rules.required.bind({
      errorMsg: 'live-less-than-6-months:severeCondition.errors.required',
    }),
  ]),
};
