import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Statutory pay other validator');

export default () => [
  field('statutoryPayOther').validators([
    r.required.make({
      errorMsg: 'statutory-pay-other:statutoryPayOther.errors.required',
    }),
    r.inArray.make({
      source: ['maternity', 'paternity', 'adoption', 'sharedParental', 'none'],
      errorMsg: 'statutory-pay-other:statutoryPayOther.errors.required',
    }),
  ]),
];
