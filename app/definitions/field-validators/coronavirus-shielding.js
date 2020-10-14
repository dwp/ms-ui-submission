const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Coronavirus shielding validator');

module.exports = {
  coronavirusShielding: SimpleField([
    rules.required.bind({
      errorMsg: 'coronavirus-shielding:coronavirusShielding.errors.required',
    }),
  ]),
};
