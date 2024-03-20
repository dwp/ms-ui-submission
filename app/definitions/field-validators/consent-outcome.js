import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Consent outcome field validations');

export default () => [
  field('dwpShareWithDoc').validators([
    r.required.make({
      errorMsg: 'consent-outcome:errors.required',
    }),
    r.inArray.make({
      source: ['yes', 'no'],
      errorMsg: 'consent-outcome:errors.required',
    }),
  ]),
];
