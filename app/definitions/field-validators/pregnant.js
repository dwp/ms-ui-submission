const moment = require('moment');
const { rules, SimpleField } = require('@dwp/govuk-casa/lib/Validation');
const dateExists = require('../../lib/validation-rules/date-exists.js');
const dateComponentsExist = require('../../lib/validation-rules/date-components-exist.js');
const dateYearLengthIsValid = require('../../lib/validation-rules/date-year-length-isValid.js');
const dateIsReal = require('../../lib/validation-rules/date-is-real.js');
const dateNotBefore = require('../../lib/validation-rules/date-not-before.js');
const dateOutOfRange = require('../../lib/validation-rules/date-out-of-range.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Pregnant validator');

const today = () => moment().startOf('day');
const latestValidDueDate = () => moment().startOf('day').add(10, 'months');

module.exports = {
  pregnant: SimpleField([
    rules.required.bind({
      errorMsg: 'pregnant:pregnant.errors.required',
    }),
  ]),
  dueDate: SimpleField([
    dateExists.bind({
      errorMsg: 'pregnant:dueDate.errors.required',
    }),
    dateComponentsExist.bind({
      errorMsgDayMissing: 'pregnant:dueDate.errors.missingDay',
      errorMsgMonthMissing: 'pregnant:dueDate.errors.missingMonth',
      errorMsgYearMissing: 'pregnant:dueDate.errors.missingYear',
      errorMsgDayAndMonthMissing: 'pregnant:dueDate.errors.missingDayAndMonth',
      errorMsgDayAndYearMissing: 'pregnant:dueDate.errors.missingDayAndYear',
      errorMsgMonthAndYearMissing: 'pregnant:dueDate.errors.missingMonthAndYear',
    }),
    dateYearLengthIsValid.bind({
      errorMsg: 'pregnant:dueDate.errors.badFormatYear',
    }),
    dateIsReal.bind({
      errorMsg: 'pregnant:dueDate.errors.notReal',
      errorMsgDigits: 'pregnant:dueDate.errors.notRealDigits',
    }),
    dateNotBefore.bind({
      errorMsg: 'pregnant:dueDate.errors.inPast',
    }),
    dateOutOfRange.bind({
      errorMsg: 'pregnant:dueDate.errors.outOfRange',
      earliestDate: today,
      latestDate: latestValidDueDate,
    }),
  ], (pageData) => pageData.pregnant === 'yes'),
};
