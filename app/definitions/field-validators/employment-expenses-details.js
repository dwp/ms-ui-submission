import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Employment expenses validator');

export default () => [
  field('expensesDetails').validators([
    r.required.make({
      errorMsg: 'employment-expenses-details:expensesDetails.errors.required',
    }),
    r.strlen.make({
      max: 500,
      errorMsgMax: 'employment-expenses-details:expensesDetails.errors.maxLength',
    }),
  ]),
];
