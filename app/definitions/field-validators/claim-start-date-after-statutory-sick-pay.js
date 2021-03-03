const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Claim start date after statutory sick pay validator');

module.exports = {
  claimStartDateAfterSsp: SimpleField([
    rules.required.bind({
      errorMsg: 'claim-start-date-after-statutory-sick-pay:claimStartDateAfterSsp.errors.required',
    }),
  ]),
};
