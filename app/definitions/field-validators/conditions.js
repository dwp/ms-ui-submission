const Validation = require('@dwp/govuk-casa/lib/Validation');
const dateExists = require('../../lib/validation-rules/date-exists.js');
const dateComponentsExist = require('../../lib/validation-rules/date-components-exist.js');
const dateYearLengthIsValid = require('../../lib/validation-rules/date-year-length-isValid.js');
const dateIsReal = require('../../lib/validation-rules/date-is-real.js');
const dateNotAfter = require('../../lib/validation-rules/date-not-after.js');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Conditions validator');

module.exports = {
  conditionName: SimpleField([
    rules.required.bind({
      errorMsg: 'conditions:name.errors.required',
    }),
  ]),
  conditionStartDate: SimpleField([
    dateExists.bind({
      errorMsg: 'conditions:conditionStartDate.errors.required',
    }),
    dateComponentsExist.bind({
      errorMsgDayMissing: 'conditions:conditionStartDate.errors.missingDay',
      errorMsgMonthMissing: 'conditions:conditionStartDate.errors.missingMonth',
      errorMsgYearMissing: 'conditions:conditionStartDate.errors.missingYear',
      errorMsgDayAndMonthMissing: 'conditions:conditionStartDate.errors.missingDayAndMonth',
      errorMsgDayAndYearMissing: 'conditions:conditionStartDate.errors.missingDayAndYear',
      errorMsgMonthAndYearMissing: 'conditions:conditionStartDate.errors.missingMonthAndYear',
    }),
    dateYearLengthIsValid.bind({
      errorMsg: 'conditions:conditionStartDate.errors.badFormatYear',
    }),
    dateIsReal.bind({
      errorMsg: 'conditions:conditionStartDate.errors.notReal',
      errorMsgDigits: 'conditions:conditionStartDate.errors.notRealDigits',
    }),
    dateNotAfter.bind({
      errorMsg: 'conditions:conditionStartDate.errors.inFuture',
    }),
  ]),
};
