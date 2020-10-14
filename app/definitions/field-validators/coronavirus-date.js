const { SimpleField } = require('@dwp/govuk-casa/lib/Validation');
const dateExists = require('../../lib/validation-rules/date-exists.js');
const dateComponentsExist = require('../../lib/validation-rules/date-components-exist.js');
const dateYearLengthIsValid = require('../../lib/validation-rules/date-year-length-isValid.js');
const dateIsReal = require('../../lib/validation-rules/date-is-real.js');
const dateNotAfter = require('../../lib/validation-rules/date-not-after.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Coronavirus date validator');

module.exports = {
  coronavirusDate: SimpleField([
    dateExists.bind({
      errorMsg: 'coronavirus-date:coronavirusDate.errors.required',
    }),
    dateComponentsExist.bind({
      errorMsgDayMissing: 'coronavirus-date:coronavirusDate.errors.missingDay',
      errorMsgMonthMissing: 'coronavirus-date:coronavirusDate.errors.missingMonth',
      errorMsgYearMissing: 'coronavirus-date:coronavirusDate.errors.missingYear',
      errorMsgDayAndMonthMissing: 'coronavirus-date:coronavirusDate.errors.missingDayAndMonth',
      errorMsgDayAndYearMissing: 'coronavirus-date:coronavirusDate.errors.missingDayAndYear',
      errorMsgMonthAndYearMissing: 'coronavirus-date:coronavirusDate.errors.missingMonthAndYear',
    }),
    dateYearLengthIsValid.bind({
      errorMsg: 'coronavirus-date:coronavirusDate.errors.badFormatYear',
    }),
    dateIsReal.bind({
      errorMsg: 'coronavirus-date:coronavirusDate.errors.notReal',
      errorMsgDigits: 'coronavirus-date:coronavirusDate.errors.notRealDigits',
    }),
    dateNotAfter.bind({
      errorMsg: 'coronavirus-date:coronavirusDate.errors.outOfRange',
    }),
  ]),
};
