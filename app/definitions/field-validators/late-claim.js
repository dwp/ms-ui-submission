import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Late claim validator');

export default () => [
  field('lateClaim').validators([
    r.required.make({
      errorMsg: 'late-claim:lateClaim.errors.required',
    }),
  ]),
];
