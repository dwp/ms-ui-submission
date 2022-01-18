const { rules, SimpleField } = require('@dwp/govuk-casa/lib/Validation');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Hospital inpatient validator');

module.exports = {
  hospitalInpatient: SimpleField([
    rules.required.bind({
      errorMsg: 'hospital-inpatient:hospitalInpatient.errors.required',
    }),
  ]),
};
