import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Remove function validator');

export default () => [
  field('remove').validators([
    r.required.make({
      errorMsg: 'remove:remove.errors.required',
    }),
    r.inArray.make({
      source: ['yes', 'no'],
      errorMsg: 'remove:remove.errors.required',
    }),
  ]),
];
