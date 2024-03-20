import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Statutory pay validator');

export default () => [
  field('statutoryPay').validators([
    r.required.make({
      errorMsg: 'statutory-pay:statutoryPay.errors.required',
    }),
  ]),
];
