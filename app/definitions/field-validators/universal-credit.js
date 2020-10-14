const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Universal Credit validator');

module.exports = {
  universalCredit: SimpleField([
    rules.required.bind({
      errorMsg: 'universal-credit:universalCredit.errors.required',
    }),
  ]),
};
