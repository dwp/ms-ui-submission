import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Employment expenses validator');

export default () => [
  field('expenses').validators([
    r.required.make({
      errorMsg: 'employment-expenses:expenses.errors.required',
    }),
  ]),
];
