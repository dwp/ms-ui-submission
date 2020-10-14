const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('get-national-insurance-credits for claim validator');

module.exports = {
  whatDoYouWantToDo: SimpleField([
    rules.required.bind({
      errorMsg: 'get-national-insurance-credits:error',
    }),
  ]),
};
