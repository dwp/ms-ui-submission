const { rules, SimpleField } = require('@dwp/govuk-casa/lib/Validation');
const dateExists = require('../../lib/validation-rules/date-exists.js');
const dateComponentsExist = require('../../lib/validation-rules/date-components-exist.js');
const dateYearLengthIsValid = require('../../lib/validation-rules/date-year-length-isValid.js');
const dateIsReal = require('../../lib/validation-rules/date-is-real.js');
const dateNotBefore = require('../../lib/validation-rules/date-not-before.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Claim end date validator');

module.exports = {
  hiddenClaimStartDate: SimpleField([
    rules.optional,
  ]),
  claimEnd: SimpleField([
    rules.required.bind({
      errorMsg: 'claim-end-date:claimEnd.errors.required',
    }),
    rules.inArray.bind({
      source: ['yes', 'no'],
      errorMsg: 'claim-end-date:claimEnd.errors.required',
    }),
  ]),
  claimEndDate: SimpleField([
    dateExists.bind({
      errorMsg: 'claim-end-date:claimEndDate.errors.required',
    }),
    dateComponentsExist.bind({
      errorMsgDayMissing: 'claim-end-date:claimEndDate.errors.missingDay',
      errorMsgMonthMissing: 'claim-end-date:claimEndDate.errors.missingMonth',
      errorMsgYearMissing: 'claim-end-date:claimEndDate.errors.missingYear',
      errorMsgDayAndMonthMissing: 'claim-end-date:claimEndDate.errors.missingDayAndMonth',
      errorMsgDayAndYearMissing: 'claim-end-date:claimEndDate.errors.missingDayAndYear',
      errorMsgMonthAndYearMissing: 'claim-end-date:claimEndDate.errors.missingMonthAndYear',
    }),
    dateYearLengthIsValid.bind({
      errorMsg: 'claim-end-date:claimEndDate.errors.badFormatYear',
    }),
    dateIsReal.bind({
      errorMsg: 'claim-end-date:claimEndDate.errors.notReal',
      errorMsgDigits: 'claim-end-date:claimEndDate.errors.notRealDigits',
    }),
    dateNotBefore.bind({
      errorMsg: 'claim-end-date:claimEndDate.errors.outOfRange',
    }),
  ], (pageData) => pageData.claimEnd === 'yes'),
};
