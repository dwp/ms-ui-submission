const { rules, SimpleField } = require('@dwp/govuk-casa/lib/Validation');
const dateExists = require('../../lib/validation-rules/date-exists.js');
const dateComponentsExist = require('../../lib/validation-rules/date-components-exist.js');
const dateYearLengthIsValid = require('../../lib/validation-rules/date-year-length-isValid.js');
const dateIsReal = require('../../lib/validation-rules/date-is-real.js');
const dateNotAfter = require('../../lib/validation-rules/date-not-after.js');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Hospital inpatient validator');

module.exports = {
  hospitalInpatient: SimpleField([
    rules.required.bind({
      errorMsg: 'hospital-inpatient:hospitalInpatient.errors.required',
    }),
  ]),

  hospitalName: SimpleField([
    rules.required.bind({
      errorMsg: 'hospital-inpatient:hospitalName.errors.required',
    }),
  ], (pageData) => pageData.hospitalInpatient === 'yes'),

  hospitalWard: SimpleField([
    rules.required.bind({
      errorMsg: 'hospital-inpatient:hospitalWard.errors.required',
    }),
  ], (pageData) => pageData.hospitalInpatient === 'yes'),

  admissionDate: SimpleField([
    dateExists.bind({
      errorMsg: 'hospital-inpatient:admissionDate.errors.required',
    }),
    dateComponentsExist.bind({
      errorMsgDayMissing: 'hospital-inpatient:admissionDate.errors.missingDay',
      errorMsgMonthMissing: 'hospital-inpatient:admissionDate.errors.missingMonth',
      errorMsgYearMissing: 'hospital-inpatient:admissionDate.errors.missingYear',
      errorMsgDayAndMonthMissing: 'hospital-inpatient:admissionDate.errors.missingDayAndMonth',
      errorMsgDayAndYearMissing: 'hospital-inpatient:admissionDate.errors.missingDayAndYear',
      errorMsgMonthAndYearMissing: 'hospital-inpatient:admissionDate.errors.missingMonthAndYear',
    }),
    dateYearLengthIsValid.bind({
      errorMsg: 'hospital-inpatient:admissionDate.errors.badFormatYear',
    }),
    dateIsReal.bind({
      errorMsg: 'hospital-inpatient:admissionDate.errors.notReal',
      errorMsgDigits: 'hospital-inpatient:admissionDate.errors.notRealDigits',
    }),
    dateNotAfter.bind({
      errorMsg: 'hospital-inpatient:admissionDate.errors.inFuture',
    }),

  ], (pageData) => pageData.hospitalInpatient === 'yes'),
};
