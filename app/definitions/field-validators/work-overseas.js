import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Work overseas validator');

export default () => [
  field('workOverseas').validators([
    r.required.make({
      errorMsg: 'work-overseas:errors.required',
    }),
    r.inArray.make({
      source: ['yes', 'no'],
      errorMsg: 'work-overseas:errors.required',
    }),
  ]),
];
