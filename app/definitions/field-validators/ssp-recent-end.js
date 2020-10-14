const moment = require('moment');
const { SimpleField } = require('@dwp/govuk-casa/lib/Validation');
const dateExists = require('../../lib/validation-rules/date-exists.js');
const dateComponentsExist = require('../../lib/validation-rules/date-components-exist.js');
const dateYearLengthIsValid = require('../../lib/validation-rules/date-year-length-isValid.js');
const dateIsReal = require('../../lib/validation-rules/date-is-real.js');
const dateNotAfter = require('../../lib/validation-rules/date-not-after.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Statutory sick pay recent end date validator');

const yesterday = () => moment().subtract(1, 'days').startOf('day');

module.exports = {
  sspRecentEndDate: SimpleField([
    dateExists.bind({
      errorMsg: 'ssp-recent-end:sspRecentEndDate.errors.required',
    }),
    dateComponentsExist.bind({
      errorMsgDayMissing: 'ssp-recent-end:sspRecentEndDate.errors.missingDay',
      errorMsgMonthMissing: 'ssp-recent-end:sspRecentEndDate.errors.missingMonth',
      errorMsgYearMissing: 'ssp-recent-end:sspRecentEndDate.errors.missingYear',
      errorMsgDayAndMonthMissing: 'ssp-recent-end:sspRecentEndDate.errors.missingDayAndMonth',
      errorMsgDayAndYearMissing: 'ssp-recent-end:sspRecentEndDate.errors.missingDayAndYear',
      errorMsgMonthAndYearMissing: 'ssp-recent-end:sspRecentEndDate.errors.missingMonthAndYear',
    }),
    dateYearLengthIsValid.bind({
      errorMsg: 'ssp-recent-end:sspRecentEndDate.errors.badFormatYear',
    }),
    dateIsReal.bind({
      errorMsg: 'ssp-recent-end:sspRecentEndDate.errors.notReal',
      errorMsgDigits: 'ssp-recent-end:sspRecentEndDate.errors.notRealDigits',
    }),
    dateNotAfter.bind({
      errorMsg: 'ssp-recent-end:sspRecentEndDate.errors.inFuture',
      dateToCheckAgainst: yesterday,
    }),
  ]),
};
