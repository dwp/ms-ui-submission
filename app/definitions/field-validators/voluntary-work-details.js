const { SimpleField, rules } = require('@dwp/govuk-casa/lib/Validation');
const validatePostalAddress = require('../../lib/validation-rules/postalAddress-validator.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Voluntary work details validator');

module.exports = {
  organisationName: SimpleField([
    rules.required.bind({
      errorMsg: 'voluntary-work-details:organisationName.errors.required',
    }),
  ]),
  organisationAddress: SimpleField([
    validatePostalAddress.bind({
      requiredFields: ['address1', 'postcode'],
      errorMsgAddress1: 'voluntary-work-details:organisationAddress.address1.errors.required',
      errorMsgPostcode: 'voluntary-work-details:organisationAddress.postcode.errors.required',
      altRegex: /^[^0-9]*$/,
    }),
  ]),
};
