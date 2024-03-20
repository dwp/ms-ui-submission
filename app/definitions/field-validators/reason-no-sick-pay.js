import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('No statutory sick pay reason validator');

export default () => [
  field('statutoryPayNoReason').validators([
    r.required.make({
      errorMsg: 'reason-no-sick-pay:error',
    }),
  ]),
];
