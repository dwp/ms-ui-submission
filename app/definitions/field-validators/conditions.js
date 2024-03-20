import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';
import dateComponentsExist from '../../../src/lib/validators/date-components-exist.js';
import dateYearLengthIsValid from '../../../src/lib/validators/date-year-length-isValid.js';
import dateIsReal from '../../../src/lib/validators/date-is-real.js';
import dateNotAfter from '../../../src/lib/validators/date-not-after.js';

const appLogger = logger();
appLogger.info('Conditions fields validations');

export default () => [
  field('conditionName').validators([
    r.required.make({
      errorMsg: 'conditions:name.errors.required',
    }),
  ]),
  field('conditionStartDate').validators([
    r.required.make({
      errorMsg: {
        summary: 'conditions:conditionStartDate.errors.required',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]'],
      },
    }),
    dateComponentsExist.make({
      errorMsgDayMissing: {
        summary: 'conditions:conditionStartDate.errors.missingDay',
        focusSuffix: ['[dd]'],
      },
      errorMsgMonthMissing: {
        summary: 'conditions:conditionStartDate.errors.missingMonth',
        focusSuffix: ['[mm]']
      },
      errorMsgYearMissing: {
        summary: 'conditions:conditionStartDate.errors.missingYear',
        focusSuffix: ['[yyyy]']
      },
      errorMsgDayAndMonthMissing: {
        summary: 'conditions:conditionStartDate.errors.missingDayAndMonth',
        focusSuffix: ['[dd]', '[mm]']
      },
      errorMsgDayAndYearMissing: {
        summary: 'conditions:conditionStartDate.errors.missingDayAndYear',
        focusSuffix: ['[dd]', '[yyyy]']
      },
      errorMsgMonthAndYearMissing: {
        summary: 'conditions:conditionStartDate.errors.missingMonthAndYear',
        focusSuffix: ['[mm]', '[yyyy]']
      },
    }),
    dateYearLengthIsValid.make({
      errorMsg: {
        summary: 'conditions:conditionStartDate.errors.badFormatYear',
        focusSuffix: ['[yyyy]']
      }
    }),
    dateIsReal.make({
      errorMsg: {
        summary: 'conditions:conditionStartDate.errors.notReal',
      },
      errorMsgDigits: {
        summary: 'conditions:conditionStartDate.errors.notRealDigits',
      },
    }),
    dateNotAfter.make({
      allowSingleDigitDay: true,
      allowSingleDigitMonth: true,
      errorMsg: {
        summary: 'conditions:conditionStartDate.errors.inFuture',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]'],
      },
    }),
    r.dateObject.make({
      allowSingleDigitDay: true,
      allowSingleDigitMonth: true,
      errorMsg: {
        summary: 'conditions:conditionStartDate.errors.required',
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
