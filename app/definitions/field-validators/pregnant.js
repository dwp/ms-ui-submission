const { rules, SimpleField } = require('@dwp/govuk-casa/lib/Validation');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Pregnant validator');

module.exports = {
  pregnant: SimpleField([
    rules.required.bind({
      errorMsg: 'pregnant:pregnant.errors.required',
    }),
  ]),
};
