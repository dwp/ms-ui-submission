const { rules, SimpleField } = require('@dwp/govuk-casa/lib/Validation');
const dateComponentsExist = require('../../lib/validation-rules/date-components-exist.js');
const dateYearLengthIsValid = require('../../lib/validation-rules/date-year-length-isValid.js');
const dateIsReal = require('../../lib/validation-rules/date-is-real.js');
const dateNotAfter = require('../../lib/validation-rules/date-not-after.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Insurance employer validator');

module.exports = {
  endDate: SimpleField([
    dateComponentsExist.bind({
      errorMsgDayMissing: 'insurance-employer:endDate.errors.missingDay',
      errorMsgMonthMissing: 'insurance-employer:endDate.errors.missingMonth',
      errorMsgYearMissing: 'insurance-employer:endDate.errors.missingYear',
      errorMsgDayAndMonthMissing: 'insurance-employer:endDate.errors.missingDayAndMonth',
      errorMsgDayAndYearMissing: 'insurance-employer:endDate.errors.missingDayAndYear',
      errorMsgMonthAndYearMissing: 'insurance-employer:endDate.errors.missingMonthAndYear',
    }),
    dateYearLengthIsValid.bind({
      errorMsg: 'insurance-employer:endDate.errors.badFormatYear',
    }),
    dateIsReal.bind({
      errorMsg: 'insurance-employer:endDate.errors.notReal',
      errorMsgDigits: 'insurance-employer:endDate.errors.notRealDigits',
    }),
    dateNotAfter.bind({
      errorMsg: 'insurance-employer:endDate.errors.inPast',
    }),
    rules.optional,
  ], (pageData) => pageData.stillWork === 'no'),

  stillWork: SimpleField([
    rules.optional,
  ]),
};
