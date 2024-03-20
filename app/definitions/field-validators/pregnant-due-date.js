import { DateTime } from 'luxon';
import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';
import dateComponentsExist from '../../../src/lib/validators/date-components-exist.js';
import dateYearLengthIsValid from '../../../src/lib/validators/date-year-length-isValid.js';
import dateIsReal from '../../../src/lib/validators/date-is-real.js';
import dateNotBefore from '../../../src/lib/validators/date-not-before.js';
import dateOutOfRange from '../../../src/lib/validators/date-out-of-range.js';

const appLogger = logger();
appLogger.info('Pregnant due date validator');

const today = () => DateTime.now().startOf('day');
const latestValidDueDate = () => DateTime.now().startOf('day').plus({ months: 10 });

export default () => [
  field('dueDate').validators([
    r.required.make({
      errorMsg: {
        summary: 'pregnant-due-date:dueDate.errors.required',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]'],
      },
    }),
    dateComponentsExist.make({
      errorMsgDayMissing: {
        summary: 'pregnant-due-date:dueDate.errors.missingDay',
        focusSuffix: ['[dd]'],
      },
      errorMsgMonthMissing: {
        summary: 'pregnant-due-date:dueDate.errors.missingMonth',
        focusSuffix: ['[mm]']
      },
      errorMsgYearMissing: {
        summary: 'pregnant-due-date:dueDate.errors.missingYear',
        focusSuffix: ['[yyyy]']
      },
      errorMsgDayAndMonthMissing: {
        summary: 'pregnant-due-date:dueDate.errors.missingDayAndMonth',
        focusSuffix: ['[dd]', '[mm]']
      },
      errorMsgDayAndYearMissing: {
        summary: 'pregnant-due-date:dueDate.errors.missingDayAndYear',
        focusSuffix: ['[dd]', '[yyyy]']
      },
      errorMsgMonthAndYearMissing: {
        summary: 'pregnant-due-date:dueDate.errors.missingMonthAndYear',
        focusSuffix: ['[mm]', '[yyyy]']
      },
    }),
    dateYearLengthIsValid.make({
      errorMsg: {
        summary: 'pregnant-due-date:dueDate.errors.badFormatYear',
        focusSuffix: ['[yyyy]']
      }
    }),
    dateIsReal.make({
      errorMsg: {
        summary: 'pregnant-due-date:dueDate.errors.notReal',
      },
      errorMsgDigits: {
        summary: 'pregnant-due-date:dueDate.errors.notRealDigits',
      },
    }),
    dateNotBefore.make({
      errorMsg: {
        summary: 'pregnant-due-date:dueDate.errors.inPast',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]'],
      },
    }),
    dateOutOfRange.make({
      errorMsg: {
        summary: 'pregnant-due-date:dueDate.errors.outOfRange',
        focusSuffix: ['[dd]', '[mm]', '[yyyy]'],
      },
      earliestDate: today,
      latestDate: latestValidDueDate,
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
