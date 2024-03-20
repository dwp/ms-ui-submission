import { DateTime } from 'luxon';
import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';
import dateComponentsExist from '../../../src/lib/validators/date-components-exist.js';
import dateYearLengthIsValid from '../../../src/lib/validators/date-year-length-isValid.js';
import dateIsReal from '../../../src/lib/validators/date-is-real.js';
import dateNotAfter from '../../../src/lib/validators/date-not-after.js';
import dateNotBefore from '../../../src/lib/validators/date-not-before.js';

const appLogger = logger();
appLogger.info('Claim Start Date field validations');

const threeMonthsFuture = () => DateTime.now().startOf('day').plus({ months: 3 });

export default () => [
  field('hiddenSspEndDate', { optional: true }).validators([
    r.required.make(),
  ]),
  field('claimStartDate').validators([
    r.required.make({
      errorMsg: {
        summary: 'claim-start-date:claimStartDate.errors.required',
        focustSuffix: ['[dd]', '[mm]', '[yyyy]'],
      },
    }),
    dateComponentsExist.make({
      errorMsgDayMissing: {
        summary: 'claim-start-date:claimStartDate.errors.missingDay',
        focusSuffix: ['[dd]'],
      },
      errorMsgMonthMissing: {
        summary: 'claim-start-date:claimStartDate.errors.missingMonth',
        focusSuffix: ['[mm]'],
      },
      errorMsgYearMissing: {
        summary: 'claim-start-date:claimStartDate.errors.missingYear',
        focusSuffix: ['[yyyy]'],
      },
      errorMsgDayAndMonthMissing: {
        summary: 'claim-start-date:claimStartDate.errors.missingDayAndMonth',
        focusSuffix: ['[dd]', '[mm]'],
      },
      errorMsgDayAndYearMissing: {
        summary: 'claim-start-date:claimStartDate.errors.missingDayAndYear',
        focusSuffix: ['[dd]', '[yyyy]'],
      },
      errorMsgMonthAndYearMissing: {
        summary: 'claim-start-date:claimStartDate.errors.missingMonthAndYear',
        focusSuffix: ['[mm]', '[yyyy]'],
      },
    }),
    dateYearLengthIsValid.make({
      errorMsg: {
        summary: 'claim-start-date:claimStartDate.errors.badFormatYear',
        focusSuffix: ['[yyyy]'],
      },
    }),
    dateIsReal.make({
      errorMsg: {
        summary: 'claim-start-date:claimStartDate.errors.notReal',
      },
      errorMsgDigits: {
        summary: 'claim-start-date:claimStartDate.errors.notRealDigits',
      },
    }),
    dateNotAfter.make({
      allowSingleDigitDay: true,
      allowSingleDigitMonth: true,
      dateToCheckAgainst: threeMonthsFuture,
      errorMsg: {
        summary: 'claim-start-date:claimStartDate.errors.outOfRange',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]'],
      },
    }),
    dateNotBefore.make({
      allowSingleDigitDay: true,
      allowSingleDigitMonth: true,
      errorMsg: {
        summary: 'claim-start-date:claimStartDate.errors.beforeSsp',
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
