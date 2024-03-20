import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Claim start date after statutory sick pay validations');

export default () => [
  field('claimStartDateAfterSsp').validators([
    r.required.make({
      errorMsg: 'claim-start-date-after-statutory-sick-pay:claimStartDateAfterSsp.errors.required',
    }),
  ]),
];
