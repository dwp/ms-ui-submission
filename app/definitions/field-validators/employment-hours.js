const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Employment hours validator');

module.exports = {
  sameHours: SimpleField([
    rules.required.bind({
      errorMsg: 'employment-hours:sameHours.errors.required',
    }),
    rules.inArray.bind({
      source: ['yes', 'no'],
      errorMsg: 'employment-hours:sameHours.errors.required',
    }),
  ]),

  hours: SimpleField([
    rules.required.bind({
      errorMsg: 'employment-hours:hours.errors.required',
    }),
    rules.regex.bind({
      errorMsg: 'employment-hours:hours.errors.notNum',
      pattern: /^[0-9.]*$/,
    }),
    rules.regex.bind({
      errorMsg: 'employment-hours:hours.errors.badFormat',
      pattern: /^[0-9]{1,2}(\.[0-9])?$/,
    }),
  ], (pageData) => pageData.sameHours === 'yes'),
};
