import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('DS1500 report fields validations');

export default () => [
  field('sr1Report').validators([
    r.required.make({
      errorMsg: 'sr1-report:sr1Report.errors.required',
    }),
    r.inArray.make({
      source: ['yes', 'no', 'dontKnow'],
      errorMsg: 'sr1-report:sr1Report.errors.required',
    }),
  ]),
];
