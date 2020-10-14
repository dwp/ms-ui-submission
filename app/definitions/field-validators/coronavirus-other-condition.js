const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Coronavirus other condition validator');

module.exports = {
  coronavirusOtherCondition: SimpleField([
    rules.required.bind({
      errorMsg: 'coronavirus-other-condition:coronavirusOtherCondition.errors.required',
    }),
  ]),
};
