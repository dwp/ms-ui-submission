import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Employment pay frequency (same hours) validator');

export default () => [
  field('frequency').validators([
    r.required.make({
      errorMsg: 'employment-pay-frequency-samehours:frequency.errors.required',
    }),
  ]),
  field('netPay').validators([
    r.required.make({
      errorMsg: 'employment-pay-frequency-samehours:netPay.errors.required',
    }),
    r.regex.make({
      errorMsg: 'employment-pay-frequency-samehours:netPay.errors.notNum',
      pattern: /^[0-9.]*$/,
    }),
    r.regex.make({
      errorMsg: 'employment-pay-frequency-samehours:netPay.errors.badFormat',
      pattern: /^[0-9]{1,}(\.[0-9]{1,2})?$/,
    }),
  ]),
];
