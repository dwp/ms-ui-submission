import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Statutory sick pay recent validator');

export default () => [
  field('sspRecent').validators([
    r.required.make({
      errorMsg: 'statutory-sick-pay-recent:sspRecent.errors.required',
    }),
  ]),
];
