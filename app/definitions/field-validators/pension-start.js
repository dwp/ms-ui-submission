const { SimpleField, rules } = require('@dwp/govuk-casa/lib/Validation');
const dateExists = require('../../lib/validation-rules/date-exists.js');
const dateComponentsExist = require('../../lib/validation-rules/date-components-exist.js');
const dateYearLengthIsValid = require('../../lib/validation-rules/date-year-length-isValid.js');
const dateIsReal = require('../../lib/validation-rules/date-is-real.js');
const dateNotAfter = require('../../lib/validation-rules/date-not-after.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Pension start validator');

module.exports = {
  pensionStartDate: SimpleField([
    dateExists.bind({
      errorMsg: 'pension-start:pensionStartDate.errors.required',
    }),
    dateComponentsExist.bind({
      errorMsgDayMissing: 'pension-start:pensionStartDate.errors.missingDay',
      errorMsgMonthMissing: 'pension-start:pensionStartDate.errors.missingMonth',
      errorMsgYearMissing: 'pension-start:pensionStartDate.errors.missingYear',
      errorMsgDayAndMonthMissing: 'pension-start:pensionStartDate.errors.missingDayAndMonth',
      errorMsgDayAndYearMissing: 'pension-start:pensionStartDate.errors.missingDayAndYear',
      errorMsgMonthAndYearMissing: 'pension-start:pensionStartDate.errors.missingMonthAndYear',
    }),
    dateYearLengthIsValid.bind({
      errorMsg: 'pension-start:pensionStartDate.errors.badFormatYear',
    }),
    dateIsReal.bind({
      errorMsg: 'pension-start:pensionStartDate.errors.notReal',
      errorMsgDigits: 'pension-start:pensionStartDate.errors.notRealDigits',
    }),
    dateNotAfter.bind({
      errorMsg: 'pension-start:pensionStartDate.errors.outOfRange',
    }),
    rules.optional,
  ]),
};
