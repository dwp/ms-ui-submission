const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Pension frequency validator');

module.exports = {
  frequency: SimpleField([
    rules.optional,
  ]),
};
