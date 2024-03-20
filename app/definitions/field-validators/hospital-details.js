import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';
import dateComponentsExist from '../../../src/lib/validators/date-components-exist.js';
import dateYearLengthIsValid from '../../../src/lib/validators/date-year-length-isValid.js';
import dateIsReal from '../../../src/lib/validators/date-is-real.js';
import dateNotAfter from '../../../src/lib/validators/date-not-after.js';
import validateSpecialChar from '../../../src/lib/validators/special-char-validator.js';

const appLogger = logger();
appLogger.info('Hospital details validator');

export default () => [
  field('hospitalName').validators([
    r.required.make({
      errorMsg: 'hospital-details:hospitalName.errors.required',
    }),
    validateSpecialChar.make({
      errorMsg: {
        summary: 'hospital-details:hospitalName.errors.badFormat',
      },
    }),
  ]),
  field('hospitalWard').validators([
    r.required.make({
      errorMsg: 'hospital-details:hospitalWard.errors.required',
    }),
    validateSpecialChar.make({
      errorMsg: {
        summary: 'hospital-details:hospitalWard.errors.badFormat',
      },
    }),
  ]),
  field('admissionDate').validators([
    r.required.make({
      errorMsg: 'hospital-details:admissionDate.errors.required',
      focusSuffix: ['[dd]', '[mm]', '[yyyy]'],
    }),
    dateComponentsExist.make({
      errorMsgDayMissing: {
        summary: 'hospital-details:admissionDate.errors.missingDay',
        focusSuffix: ['[dd]'],
      },
      errorMsgMonthMissing: {
        summary: 'hospital-details:admissionDate.errors.missingMonth',
        focusSuffix: ['[mm]'],
      },
      errorMsgYearMissing: {
        summary: 'hospital-details:admissionDate.errors.missingYear',
        focusSuffix: ['[yyyy]'],
      },
      errorMsgDayAndMonthMissing: {
        summary: 'hospital-details:admissionDate.errors.missingDayAndMonth',
        focusSuffix: ['[dd]', '[mm]'],
      },
      errorMsgDayAndYearMissing: {
        summary: 'hospital-details:admissionDate.errors.missingDayAndYear',
        focusSuffix: ['[dd]', '[yyyy]'],
      },
      errorMsgMonthAndYearMissing: {
        summary: 'hospital-details:admissionDate.errors.missingMonthAndYear',
        focusSuffix: ['[mm]', '[yyyy]'],
      },
    }),
    dateYearLengthIsValid.make({
      errorMsg: {
        summary: 'hospital-details:admissionDate.errors.badFormatYear',
        focusSuffix: ['[yyyy]'],
      },
    }),
    dateIsReal.make({
      errorMsg: {
        summary: 'hospital-details:admissionDate.errors.notReal',
      },
      errorMsgDigits: {
        summary: 'hospital-details:admissionDate.errors.notRealDigits',
      },
    }),
    dateNotAfter.make({
      allowSingleDigitDay: true,
      allowSingleDigitMonth: true,
      errorMsg: {
        summary: 'hospital-details:admissionDate.errors.inFuture',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]'],
      },
    }),
  ]).processors([
    // Trim spaces from each attribute
    (value) => ({
      dd: value.dd.replace(/\s+/g, ''),
      mm: value.mm.replace(/\s+/g, ''),
      yyyy: value.yyyy.replace(/\s+/g, ''),
    }),
  ]),
];

// Code commented out if causing the app not to load
