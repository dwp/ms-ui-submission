import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';
import dateComponentsExist from '../../../src/lib/validators/date-components-exist.js';
import dateYearLengthIsValid from '../../../src/lib/validators/date-year-length-isValid.js';
import dateIsReal from '../../../src/lib/validators/date-is-real.js';
import dateNotAfter from '../../../src/lib/validators/date-not-after.js';

const appLogger = logger();
appLogger.info('Date of Birth field validations');

export default () => [
  field('dateOfBirth').validators([
    r.required.make({
      errorMsg: {
        summary: 'date-of-birth:dateOfBirth.errors.required',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]'],
      },
    }),
    dateComponentsExist.make({
      errorMsgDayMissing: {
        summary: 'date-of-birth:dateOfBirth.errors.missingDay',
        focusSuffix: ['[dd]'],
      },
      errorMsgMonthMissing: {
        summary: 'date-of-birth:dateOfBirth.errors.missingMonth',
        focusSuffix: ['[mm]'],
      },
      errorMsgYearMissing: {
        summary: 'date-of-birth:dateOfBirth.errors.missingYear',
        focusSuffix: ['[yyyy]'],
      },
      errorMsgDayAndMonthMissing: {
        summary: 'date-of-birth:dateOfBirth.errors.missingDayAndMonth',
        focusSuffix: ['[dd]', '[mm]'],
      },
      errorMsgDayAndYearMissing: {
        summary: 'date-of-birth:dateOfBirth.errors.missingDayAndYear',
        focusSuffix: ['[dd]', '[yyyy]'],
      },
      errorMsgMonthAndYearMissing: {
        summary: 'date-of-birth:dateOfBirth.errors.missingMonthAndYear',
        focusSuffix: ['[mm]', '[yyyy]'],
      },
    }),
    dateYearLengthIsValid.make({
      errorMsg: {
        summary: 'date-of-birth:dateOfBirth.errors.badFormatYear',
        focusSuffix: ['[yyyy]'],
      },
    }),
    dateIsReal.make({
      errorMsg: {
        summary: 'date-of-birth:dateOfBirth.errors.notReal',
      },
      errorMsgDigits: {
        summary: 'date-of-birth:dateOfBirth.errors.notRealDigits',
      },
    }),
    dateNotAfter.make({
      allowSingleDigitDay: true,
      allowSingleDigitMonth: true,
      errorMsg: {
        summary: 'date-of-birth:dateOfBirth.errors.outOfRange',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]'],
      },
    }),
    r.dateObject.make({
      allowSingleDigitDay: true,
      allowSingleDigitMonth: true,
      beforeOffsetFromNow: { days: 1 },
      errorMsg: {
        summary: 'date-of-birth:dateOfBirth.errors.notReal',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]'],
      },
      errorMsgBeforeOffset: {
        summary: 'date-of-birth:dateOfBirth.errors.outOfRange',
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
