const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Name validator');

module.exports = {
  firstName: SimpleField([
    rules.required.bind({
      errorMsg: 'name:firstName.errors.required',
    }),
  ]),
  lastName: SimpleField([
    rules.required.bind({
      errorMsg: 'name:lastName.errors.required',
    }),
  ]),
};
