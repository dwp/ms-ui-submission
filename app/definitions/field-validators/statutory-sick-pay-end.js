import { DateTime } from 'luxon';
import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';
import dateComponentsExist from '../../../src/lib/validators/date-components-exist.js';
import dateYearLengthIsValid from '../../../src/lib/validators/date-year-length-isValid.js';
import dateIsReal from '../../../src/lib/validators/date-is-real.js';
import dateNotAfter from '../../../src/lib/validators/date-not-after.js';

const appLogger = logger();
appLogger.info('Statutory sick pay end date validator');

const dateToCheckAgainst = () => DateTime.now().startOf('day').plus({ months: 3 });

export default () => [
  field('sspEndDate').validators([
    r.required.make({
      errorMsg: 'statutory-sick-pay-end:sspEndDate.errors.required',
      focusSuffix: ['[dd]', '[mm]', '[yyyy]'],
    }),
    dateComponentsExist.make({
      errorMsgDayMissing: {
        summary: 'statutory-sick-pay-end:sspEndDate.errors.missingDay',
        focusSuffix: ['[dd]'],
      },
      errorMsgMonthMissing: {
        summary: 'statutory-sick-pay-end:sspEndDate.errors.missingMonth',
        focusSuffix: ['[mm]']
      },
      errorMsgYearMissing: {
        summary: 'statutory-sick-pay-end:sspEndDate.errors.missingYear',
        focusSuffix: ['[yyyy]']
      },
      errorMsgDayAndMonthMissing: {
        summary: 'statutory-sick-pay-end:sspEndDate.errors.missingDayAndMonth',
        focusSuffix: ['[dd]', '[mm]']
      },
      errorMsgDayAndYearMissing: {
        summary: 'statutory-sick-pay-end:sspEndDate.errors.missingDayAndYear',
        focusSuffix: ['[dd]', '[yyyy]']
      },
      errorMsgMonthAndYearMissing: {
        summary: 'statutory-sick-pay-end:sspEndDate.errors.missingMonthAndYear',
        focusSuffix: ['[mm]', '[yyyy]']
      },
    }),
    dateYearLengthIsValid.make({
      errorMsg: {
        summary: 'statutory-sick-pay-end:sspEndDate.errors.badFormatYear',
        focusSuffix: ['[yyyy]']
      }
    }),
    dateIsReal.make({
      errorMsg: {
        summary: 'statutory-sick-pay-end:sspEndDate.errors.notReal',
      },
      errorMsgDigits: {
        summary: 'statutory-sick-pay-end:sspEndDate.errors.notRealDigits',
      },
    }),
    dateNotAfter.make({
      allowSingleDigitDay: true,
      allowSingleDigitMonth: true,
      errorMsg: {
        summary: 'statutory-sick-pay-end:sspEndDate.errors.outOfRange',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]'],
      },
      dateToCheckAgainst,
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
