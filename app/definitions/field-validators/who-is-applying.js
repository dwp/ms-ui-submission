import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('who-is-applying validator');

export default () => [
  field('whoIsApplying').validators([
    r.required.make({
      errorMsg: 'who-is-applying:error',
    }),
  ]),
];
