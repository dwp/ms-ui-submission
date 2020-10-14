const moment = require('moment');
const { SimpleField } = require('@dwp/govuk-casa/lib/Validation');
const dateExists = require('../../lib/validation-rules/date-exists.js');
const dateComponentsExist = require('../../lib/validation-rules/date-components-exist.js');
const dateYearLengthIsValid = require('../../lib/validation-rules/date-year-length-isValid.js');
const dateIsReal = require('../../lib/validation-rules/date-is-real.js');
const dateNotAfter = require('../../lib/validation-rules/date-not-after.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Claim start date validator');

const threeMonthsFuture = () => moment().startOf('day').add(3, 'months');

module.exports = {
  claimStartDate: SimpleField([
    dateExists.bind({
      errorMsg: 'claim-start-date:claimStartDate.errors.required',
    }),
    dateComponentsExist.bind({
      errorMsgDayMissing: 'claim-start-date:claimStartDate.errors.missingDay',
      errorMsgMonthMissing: 'claim-start-date:claimStartDate.errors.missingMonth',
      errorMsgYearMissing: 'claim-start-date:claimStartDate.errors.missingYear',
      errorMsgDayAndMonthMissing: 'claim-start-date:claimStartDate.errors.missingDayAndMonth',
      errorMsgDayAndYearMissing: 'claim-start-date:claimStartDate.errors.missingDayAndYear',
      errorMsgMonthAndYearMissing: 'claim-start-date:claimStartDate.errors.missingMonthAndYear',
    }),
    dateYearLengthIsValid.bind({
      errorMsg: 'claim-start-date:claimStartDate.errors.badFormatYear',
    }),
    dateIsReal.bind({
      errorMsg: 'claim-start-date:claimStartDate.errors.notReal',
      errorMsgDigits: 'claim-start-date:claimStartDate.errors.notRealDigits',
    }),
    dateNotAfter.bind({
      errorMsg: 'claim-start-date:claimStartDate.errors.outOfRange',
      dateToCheckAgainst: threeMonthsFuture,
    }),
  ]),
};
