const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Statutory pay other validator');

module.exports = {
  statutoryPay: SimpleField([
    rules.required.bind({
      errorMsg: 'statutory-pay:statutoryPay.errors.required',
    }),
  ]),
};
