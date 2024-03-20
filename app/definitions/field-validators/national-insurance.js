import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('national-insurance validator');

export default () => [
  field('nationalInsurance').validators([
    r.required.make({
      errorMsg: 'national-insurance:error',
    }),
  ]),
];
