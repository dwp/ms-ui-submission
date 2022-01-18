const { SimpleField } = require('@dwp/govuk-casa/lib/Validation');
const validatePostalAddress = require('../../lib/validation-rules/postalAddress-validator.js');
const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Correspondence address validator');

module.exports = {
  correspondenceAddress: SimpleField([
    validatePostalAddress.bind({
      requiredFields: ['address1', 'postcode'],
      altRegex: /^[^0-9]*$/,
    }),
  ]),
};
