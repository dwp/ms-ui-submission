const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('statutory-pay-end-date for claim validator');

module.exports = {
  statutoryPayEndDate: SimpleField([
    rules.required.bind({
      errorMsg: 'statutory-pay-end-date:error',
    }),
  ]),
};
