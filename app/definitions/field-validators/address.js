const { SimpleField, rules } = require('@dwp/govuk-casa/lib/Validation');
const validatePostalAddress = require('../../lib/validation-rules/postalAddress-validator.js');
const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Address validator');

module.exports = {
  address: SimpleField([
    validatePostalAddress.bind({
      requiredFields: ['address1', 'postcode'],
      altRegex: /^[^0-9]*$/,
    }),
  ]),
  correspondenceAddress: SimpleField([
    validatePostalAddress.bind({
      requiredFields: ['address1', 'postcode'],
      altRegex: /^[^0-9]*$/,
    }),
  ], (pageData) => pageData.correspondence === 'no'),
  correspondence: SimpleField([
    rules.required.bind({
      errorMsg: 'address:correspondence.errors.required',
    }),
    rules.inArray.bind({
      source: ['yes', 'no'],
      errorMsg: 'address:correspondence.errors.required',
    }),
  ]),
};
