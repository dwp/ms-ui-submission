const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Consent outcome validator');

module.exports = {
  dwpShareWithDoc: SimpleField([
    rules.required.bind({
      errorMsg: 'consent-outcome:errors.required',
    }),
    rules.inArray.bind({
      source: ['yes', 'no'],
      errorMsg: 'consent-outcome:errors.required',
    }),
  ]),
};
