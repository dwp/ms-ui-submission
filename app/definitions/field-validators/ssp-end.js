const { SimpleField } = require('@dwp/govuk-casa/lib/Validation');
const dateExists = require('../../lib/validation-rules/date-exists.js');
const dateComponentsExist = require('../../lib/validation-rules/date-components-exist.js');
const dateYearLengthIsValid = require('../../lib/validation-rules/date-year-length-isValid.js');
const dateIsReal = require('../../lib/validation-rules/date-is-real.js');
const dateNotBefore = require('../../lib/validation-rules/date-not-before.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Statutory sick pay end date validator');

module.exports = {
  sspEndDate: SimpleField([
    dateExists.bind({
      errorMsg: 'ssp-end:sspEndDate.errors.required',
    }),
    dateComponentsExist.bind({
      errorMsgDayMissing: 'ssp-end:sspEndDate.errors.missingDay',
      errorMsgMonthMissing: 'ssp-end:sspEndDate.errors.missingMonth',
      errorMsgYearMissing: 'ssp-end:sspEndDate.errors.missingYear',
      errorMsgDayAndMonthMissing: 'ssp-end:sspEndDate.errors.missingDayAndMonth',
      errorMsgDayAndYearMissing: 'ssp-end:sspEndDate.errors.missingDayAndYear',
      errorMsgMonthAndYearMissing: 'ssp-end:sspEndDate.errors.missingMonthAndYear',
    }),
    dateYearLengthIsValid.bind({
      errorMsg: 'ssp-end:sspEndDate.errors.badFormatYear',
    }),
    dateIsReal.bind({
      errorMsg: 'ssp-end:sspEndDate.errors.notReal',
      errorMsgDigits: 'ssp-end:sspEndDate.errors.notRealDigits',
    }),
    dateNotBefore.bind({
      errorMsg: 'ssp-end:sspEndDate.errors.inPast',
    }),
  ]),
};
