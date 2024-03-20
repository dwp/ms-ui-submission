import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Universal Credit validator');

export default () => [
  field('universalCredit').validators([
    r.required.make({
      errorMsg: 'universal-credit:universalCredit.errors.required',
    }),
  ]),
];
