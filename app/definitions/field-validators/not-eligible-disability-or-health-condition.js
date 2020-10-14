const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('not-eligible-disability-or-health-condition validator');

module.exports = {
  whatDoYouWantToDo: SimpleField([
    rules.required.bind({
      errorMsg: 'not-eligible-disability-or-health-condition:error',
    }),
  ]),
};
