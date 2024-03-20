import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';
import dateComponentsExist from '../../../src/lib/validators/date-components-exist.js';
import dateYearLengthIsValid from '../../../src/lib/validators/date-year-length-isValid.js';
import dateIsReal from '../../../src/lib/validators/date-is-real.js';
import dateNotBefore from '../../../src/lib/validators/date-not-before.js';

const appLogger = logger();
appLogger.info('Claim End Date field validations');

export default () => [
  field('hiddenClaimStartDate', { optional: true }).validators([
    r.required.make(),
  ]),
  field('claimEnd').validators([
    r.required.make({
      errorMsg: 'claim-end-date:claimEnd.errors.required',
    }),
    r.inArray.make({
      source: ['yes', 'no'],
      errorMsg: 'claim-end-date:claimEnd.errors.required',
    }),
  ]),
  field('claimEndDate').validators([
    r.required.make({
      errorMsg: {
        summary: 'claim-end-date:claimEndDate.errors.required',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]'],
      },
    }),
    dateComponentsExist.make({
      errorMsgDayMissing: {
        summary: 'claim-end-date:claimEndDate.errors.missingDay',
        focusSuffix: ['[dd]'],
      },
      errorMsgMonthMissing: {
        summary: 'claim-end-date:claimEndDate.errors.missingMonth',
        focusSuffix: ['[mm]'],
      },
      errorMsgYearMissing: {
        summary: 'claim-end-date:claimEndDate.errors.missingYear',
        focusSuffix: ['[yyyy]'],
      },
      errorMsgDayAndMonthMissing: {
        summary: 'claim-end-date:claimEndDate.errors.missingDayAndMonth',
        focusSuffix: ['[dd]', '[mm]'],
      },
      errorMsgDayAndYearMissing: {
        summary: 'claim-end-date:claimEndDate.errors.missingDayAndYear',
        focusSuffix: ['[dd]', '[yyyy]'],
      },
      errorMsgMonthAndYearMissing: {
        summary: 'claim-end-date:claimEndDate.errors.missingMonthAndYear',
        focusSuffix: ['[mm]', '[yyyy]'],
      },
    }),
    dateYearLengthIsValid.make({
      errorMsg: {
        summary: 'claim-end-date:claimEndDate.errors.badFormatYear',
        focusSuffix: ['[yyyy]'],
      },
    }),
    dateIsReal.make({
      errorMsg: {
        summary: 'claim-end-date:claimEndDate.errors.notReal',
      },
      errorMsgDigits: {
        summary: 'claim-end-date:claimEndDate.errors.notRealDigits',
      },
    }),
    dateNotBefore.make({
      allowSingleDigitDay: true,
      allowSingleDigitMonth: true,
      errorMsg: {
        summary: 'claim-end-date:claimEndDate.errors.outOfRange',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]'],
      },
    }),
  ]).conditions([
    // Only validate the `claim date` field if user selects yes
    ({ journeyContext: c, waypoint: w }) => c.data?.[w]?.claimEnd === 'yes',
  ]).processors([
    // Trim spaces from each attribute
    (value) => ({
      dd: value.dd.replace(/\s+/g, ''),
      mm: value.mm.replace(/\s+/g, ''),
      yyyy: value.yyyy.replace(/\s+/g, ''),
    }),
  ]),
];
