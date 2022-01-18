const moment = require('moment');
const { SimpleField } = require('@dwp/govuk-casa/lib/Validation');
const dateExists = require('../../lib/validation-rules/date-exists.js');
const dateComponentsExist = require('../../lib/validation-rules/date-components-exist.js');
const dateYearLengthIsValid = require('../../lib/validation-rules/date-year-length-isValid.js');
const dateIsReal = require('../../lib/validation-rules/date-is-real.js');
const dateNotBefore = require('../../lib/validation-rules/date-not-before.js');
const dateOutOfRange = require('../../lib/validation-rules/date-out-of-range.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Pregnant due date validator');

const today = () => moment().startOf('day');
const latestValidDueDate = () => moment().startOf('day').add(10, 'months');

module.exports = {
  dueDate: SimpleField([
    dateExists.bind({
      errorMsg: 'pregnant-due-date:dueDate.errors.required',
    }),
    dateComponentsExist.bind({
      errorMsgDayMissing: 'pregnant-due-date:dueDate.errors.missingDay',
      errorMsgMonthMissing: 'pregnant-due-date:dueDate.errors.missingMonth',
      errorMsgYearMissing: 'pregnant-due-date:dueDate.errors.missingYear',
      errorMsgDayAndMonthMissing: 'pregnant-due-date:dueDate.errors.missingDayAndMonth',
      errorMsgDayAndYearMissing: 'pregnant-due-date:dueDate.errors.missingDayAndYear',
      errorMsgMonthAndYearMissing: 'pregnant-due-date:dueDate.errors.missingMonthAndYear',
    }),
    dateYearLengthIsValid.bind({
      errorMsg: 'pregnant-due-date:dueDate.errors.badFormatYear',
    }),
    dateIsReal.bind({
      errorMsg: 'pregnant-due-date:dueDate.errors.notReal',
      errorMsgDigits: 'pregnant-due-date:dueDate.errors.notRealDigits',
    }),
    dateNotBefore.bind({
      errorMsg: 'pregnant-due-date:dueDate.errors.inPast',
    }),
    dateOutOfRange.bind({
      errorMsg: 'pregnant-due-date:dueDate.errors.outOfRange',
      earliestDate: today,
      latestDate: latestValidDueDate,
    }),
  ]),
};
