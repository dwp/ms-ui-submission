const { SimpleField } = require('@dwp/govuk-casa/lib/Validation');
const dateExists = require('../../lib/validation-rules/date-exists.js');
const dateComponentsExist = require('../../lib/validation-rules/date-components-exist.js');
const dateYearLengthIsValid = require('../../lib/validation-rules/date-year-length-isValid.js');
const dateIsReal = require('../../lib/validation-rules/date-is-real.js');
const dateNotAfter = require('../../lib/validation-rules/date-not-after.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Date of birth validator');

module.exports = {
  dateOfBirth: SimpleField([
    dateExists.bind({
      errorMsg: 'date-of-birth:dateOfBirth.errors.required',
    }),
    dateComponentsExist.bind({
      errorMsgDayMissing: 'date-of-birth:dateOfBirth.errors.missingDay',
      errorMsgMonthMissing: 'date-of-birth:dateOfBirth.errors.missingMonth',
      errorMsgYearMissing: 'date-of-birth:dateOfBirth.errors.missingYear',
      errorMsgDayAndMonthMissing: 'date-of-birth:dateOfBirth.errors.missingDayAndMonth',
      errorMsgDayAndYearMissing: 'date-of-birth:dateOfBirth.errors.missingDayAndYear',
      errorMsgMonthAndYearMissing: 'date-of-birth:dateOfBirth.errors.missingMonthAndYear',
    }),
    dateYearLengthIsValid.bind({
      errorMsg: 'date-of-birth:dateOfBirth.errors.badFormatYear',
    }),
    dateIsReal.bind({
      errorMsg: 'date-of-birth:dateOfBirth.errors.notReal',
      errorMsgDigits: 'date-of-birth:dateOfBirth.errors.notRealDigits',
    }),
    dateNotAfter.bind({
      errorMsg: 'date-of-birth:dateOfBirth.errors.outOfRange',
    }),
  ]),
};
