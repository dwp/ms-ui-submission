import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Employment support validator');

export default () => [
  field('support').validators([
    r.required.make({
      errorMsg: 'employment-support:support.errors.required',
    }),
    r.inArray.make({
      source: ['yes', 'no', 'notSure'],
      errorMsg: 'employment-support:support.errors.required',
    }),
  ]),
];
