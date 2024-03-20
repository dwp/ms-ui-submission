import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Disability or health condition fields validations');

export default () => [
  field('disabilityOrHealthCondition').validators([
    r.required.make({
      errorMsg: 'disability-or-health-condition:error',
    }),
  ]),
];
