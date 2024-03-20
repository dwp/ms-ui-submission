import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';
import dateComponentsExist from '../../../src/lib/validators/date-components-exist.js';
import dateYearLengthIsValid from '../../../src/lib/validators/date-year-length-isValid.js';
import dateIsReal from '../../../src/lib/validators/date-is-real.js';
import dateNotAfter from '../../../src/lib/validators/date-not-after.js';

const appLogger = logger();
appLogger.info('Employment last work validator');

export default () => [
  field('lastWorkedDate').validators([
    r.required.make({
      errorMsg: {
        summary: 'employment-last-work:lastWorkedDate.errors.required',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]'],
      },
    }),
    dateComponentsExist.make({
      errorMsgDayMissing: {
        summary: 'employment-last-work:lastWorkedDate.errors.missingDay',
        focusSuffix: ['[dd]'],
      },
      errorMsgMonthMissing: {
        summary: 'employment-last-work:lastWorkedDate.errors.missingMonth',
        focusSuffix: ['[mm]'],
      },
      errorMsgYearMissing: {
        summary: 'employment-last-work:lastWorkedDate.errors.missingYear',
        focusSuffix: ['[yyyy]'],
      },
      errorMsgDayAndMonthMissing: {
        summary: 'employment-last-work:lastWorkedDate.errors.missingDayAndMonth',
        focusSuffix: ['[dd]', '[mm]'],
      },
      errorMsgDayAndYearMissing: {
        summary: 'employment-last-work:lastWorkedDate.errors.missingDayAndYear',
        focusSuffix: ['[dd]', '[yyyy]'],
      },
      errorMsgMonthAndYearMissing: {
        summary: 'employment-last-work:lastWorkedDate.errors.missingMonthAndYear',
        focusSuffix: ['[mm]', '[yyyy]'],
      },
    }),
    dateYearLengthIsValid.make({
      errorMsg: {
        summary: 'employment-last-work:lastWorkedDate.errors.badFormatYear',
        focusSuffix: ['[yyyy]'],
      },
    }),
    dateIsReal.make({
      errorMsg: {
        summary: 'employment-last-work:lastWorkedDate.errors.notReal',
      },
      errorMsgDigits: {
        summary: 'employment-last-work:lastWorkedDate.errors.notRealDigits',
      },
    }),
    dateNotAfter.make({
      allowSingleDigitDay: true,
      allowSingleDigitMonth: true,
      errorMsg: {
        summary: 'employment-last-work:lastWorkedDate.errors.inFuture',
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
