import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Hospital inpatient validator');

export default () => [
  field('hospitalInpatient').validators([
    r.required.make({
      errorMsg: 'hospital-inpatient:hospitalInpatient.errors.required',
    }),
  ]),
];
