const { rules, SimpleField } = require('@dwp/govuk-casa/lib/Validation');
const dateExists = require('../../lib/validation-rules/date-exists.js');
const dateComponentsExist = require('../../lib/validation-rules/date-components-exist.js');
const dateYearLengthIsValid = require('../../lib/validation-rules/date-year-length-isValid.js');
const dateIsReal = require('../../lib/validation-rules/date-is-real.js');
const dateNotAfter = require('../../lib/validation-rules/date-not-after.js');
const validateSpecialChar = require('../../lib/validation-rules/special-char-validator.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Hospital details validator');

module.exports = {
  hospitalName: SimpleField([
    rules.required.bind({
      errorMsg: 'hospital-details:hospitalName.errors.required',
    }),
    validateSpecialChar.bind({
      errorMsg: 'hospital-details:hospitalName.errors.badFormat',
    }),
  ]),

  hospitalWard: SimpleField([
    rules.required.bind({
      errorMsg: 'hospital-details:hospitalWard.errors.required',
    }),
    validateSpecialChar.bind({
      errorMsg: 'hospital-details:hospitalWard.errors.badFormat',
      specialChars: ['<', '>'],
    }),
  ]),

  admissionDate: SimpleField([
    dateExists.bind({
      errorMsg: 'hospital-details:admissionDate.errors.required',
    }),
    dateComponentsExist.bind({
      errorMsgDayMissing: 'hospital-details:admissionDate.errors.missingDay',
      errorMsgMonthMissing: 'hospital-details:admissionDate.errors.missingMonth',
      errorMsgYearMissing: 'hospital-details:admissionDate.errors.missingYear',
      errorMsgDayAndMonthMissing: 'hospital-details:admissionDate.errors.missingDayAndMonth',
      errorMsgDayAndYearMissing: 'hospital-details:admissionDate.errors.missingDayAndYear',
      errorMsgMonthAndYearMissing: 'hospital-details:admissionDate.errors.missingMonthAndYear',
    }),
    dateYearLengthIsValid.bind({
      errorMsg: 'hospital-details:admissionDate.errors.badFormatYear',
    }),
    dateIsReal.bind({
      errorMsg: 'hospital-details:admissionDate.errors.notReal',
      errorMsgDigits: 'hospital-details:admissionDate.errors.notRealDigits',
    }),
    dateNotAfter.bind({
      errorMsg: 'hospital-details:admissionDate.errors.inFuture',
    }),

  ]),
};
