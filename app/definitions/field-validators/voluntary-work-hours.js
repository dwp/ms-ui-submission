const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Voluntary work hours validator');

module.exports = {
  sameHours: SimpleField([
    rules.required.bind({
      errorMsg: 'voluntary-work-hours:sameHours.errors.required',
    }),
  ]),

  hours: SimpleField([
    rules.required.bind({
      errorMsg: 'voluntary-work-hours:hours.errors.required',
    }),
    rules.regex.bind({
      pattern: /^\d{1,2}(\.\d)?$/,
      errorMsg: 'voluntary-work-hours:hours.errors.badFormat',
    }),
  ], (pageData) => pageData.sameHours === 'yes'),
};
