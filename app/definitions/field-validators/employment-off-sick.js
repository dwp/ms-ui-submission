import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Employment off sick validator');

export default () => [
  field('offSick').validators([
    r.required.make({
      errorMsg: 'employment-off-sick:offSick.errors.required',
    }),
    r.inArray.make({
      source: ['yes', 'no'],
      errorMsg: 'employment-off-sick:offSick.errors.required',
    }),
  ]),
];
