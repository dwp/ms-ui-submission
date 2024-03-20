import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Employment status validator');

export default () => [
  field('workTypes').validators([
    r.required.make({
      errorMsg: 'employment-status:workTypes.errors.required',
    }),
  ]),
];
