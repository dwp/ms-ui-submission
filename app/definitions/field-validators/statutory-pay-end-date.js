import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('statutory-pay-end-date for claim validator');

export default () => [
  field('statutoryPayEndDate').validators([
    r.required.make({
      errorMsg: 'statutory-pay-end-date:error',
    }),
  ]),
];
