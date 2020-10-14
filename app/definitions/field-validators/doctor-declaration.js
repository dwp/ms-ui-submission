const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Doctor declaration validator');

module.exports = {
  docShareWithDWP: SimpleField([
    rules.required.bind({
      errorMsg: 'doctor-declaration:errors.required',
    }),
    rules.inArray.bind({
      source: ['yes', 'no'],
      errorMsg: 'doctor-declaration:errors.required',
    }),
  ]),
};
