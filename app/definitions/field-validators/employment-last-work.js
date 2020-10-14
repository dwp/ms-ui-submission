const { SimpleField } = require('@dwp/govuk-casa/lib/Validation');
const dateExists = require('../../lib/validation-rules/date-exists.js');
const dateComponentsExist = require('../../lib/validation-rules/date-components-exist.js');
const dateYearLengthIsValid = require('../../lib/validation-rules/date-year-length-isValid.js');
const dateIsReal = require('../../lib/validation-rules/date-is-real.js');
const dateNotAfter = require('../../lib/validation-rules/date-not-after.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Employment last work validator');

module.exports = {
  lastWorkedDate: SimpleField([
    dateExists.bind({
      errorMsg: 'employment-last-work:lastWorkedDate.errors.required',
    }),
    dateComponentsExist.bind({
      errorMsgDayMissing: 'employment-last-work:lastWorkedDate.errors.missingDay',
      errorMsgMonthMissing: 'employment-last-work:lastWorkedDate.errors.missingMonth',
      errorMsgYearMissing: 'employment-last-work:lastWorkedDate.errors.missingYear',
      errorMsgDayAndMonthMissing: 'employment-last-work:lastWorkedDate.errors.missingDayAndMonth',
      errorMsgDayAndYearMissing: 'employment-last-work:lastWorkedDate.errors.missingDayAndYear',
      errorMsgMonthAndYearMissing: 'employment-last-work:lastWorkedDate.errors.missingMonthAndYear',
    }),
    dateYearLengthIsValid.bind({
      errorMsg: 'employment-last-work:lastWorkedDate.errors.badFormatYear',
    }),
    dateIsReal.bind({
      errorMsg: 'employment-last-work:lastWorkedDate.errors.notReal',
      errorMsgDigits: 'employment-last-work:lastWorkedDate.errors.notRealDigits',
    }),
    dateNotAfter.bind({
      errorMsg: 'employment-last-work:lastWorkedDate.errors.inFuture',
    }),
  ]),
};
