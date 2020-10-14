const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Statutory sick pay recent validator');

module.exports = {
  sspRecent: SimpleField([
    rules.required.bind({
      errorMsg: 'ssp-recent:sspRecent.errors.required',
    }),
  ]),
};
