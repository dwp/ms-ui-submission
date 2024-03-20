import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('state-pension-age validator');

export default () => [
  field('statePensionAge').validators([
    r.required.make({
      errorMsg: 'state-pension-age:error',
    }),
  ]),
];
