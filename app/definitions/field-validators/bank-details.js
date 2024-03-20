import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import validateAccountName from '../../../src/lib/validators/account-name-validator.js';
import validateSpecialChar from '../../../src/lib/validators/special-char-validator.js';
import validateAccountNumber from '../../../src/lib/validators/account-number-validator.js';
import validateSortCode from '../../../src/lib/validators/sort-code-validator.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Bank details fields validations');

export default () => [
  field('accountName').validators([
    r.required.make({
      errorMsg: {
        summary: 'bank-details:accountName.errors.required',
      },
    }),
    validateAccountName.make({
      errorMsgConsecSpaces: {
        summary: 'bank-details:accountName.errors.consecSpaces',
      },
      errorMsgConsecOther: {
        summary: 'bank-details:accountName.errors.consecOther',
      },
      errorMsgStartAndEndFormat: {
        summary: 'bank-details:accountName.errors.startAndEndFormat',
      },
      errorMsgStartFormat: {
        summary: 'bank-details:accountName.errors.startFormat',
      },
      errorMsgEndFormat: {
        summary: 'bank-details:accountName.errors.endFormat',
      },
    }),
    validateSpecialChar.make({
      errorMsg: {
        summary: 'bank-details:accountName.errors.noSpecialChar',
      },
    }),
  ]),
  field('bankName').validators([
    r.required.make({
      errorMsg: {
        summary: 'bank-details:bankName.errors.required',
      }
    }),
    validateSpecialChar.make({
      errorMsg: {
        summary: 'bank-details:bankName.errors.noSpecialChar',
      }
    }),
  ]),
  field('sortCode').validators([
    r.required.make({
      errorMsg: {
        summary: 'bank-details:sortCode.errors.required',
      },
    }),
    validateSortCode.make({
      errorMsgNotNum: {
        summary: 'bank-details:sortCode.errors.notNum',
      },
      errorBadLength: {
        summary: 'bank-details:sortCode.errors.badLength',
      },
    }),
  ]),
  field('accountNumber').validators([
    r.required.make({
      errorMsg: 'bank-details:accountNumber.errors.required',
    }),
    validateAccountNumber.make({
      errorMsgNotNum: {
        summary: 'bank-details:accountNumber.errors.notNum',
      },
      errorBadLength: {
        summary: 'bank-details:accountNumber.errors.badLength',
      },
    }),
  ]),
  field('rollNumber').validators([
    r.regex.make({
      errorMsg: {
        summary: 'bank-details:rollNumber.errors.badFormat',
      },
      pattern: /^[-\u058A\u05BE\u1806\u2010-\u2015\u2E17\u2E1A\u301C\u3030\u30A0\uFE31-\uFE32\uFE58\uFE63\uFF0D A-Za-z0-9.'/-]*$/,
    }),
  ]),
];
