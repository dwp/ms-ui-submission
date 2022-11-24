const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('No statutory sick pay reason');

module.exports = {
  statutoryPayNoReason: SimpleField([
    rules.required.bind({
      errorMsg: 'reason-no-sick-pay:error',
    }),
  ]),
};
