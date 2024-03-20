import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Military overseas validator');

export default () => [
  field('militaryOverseas').validators([
    r.required.make({
      errorMsg: 'military-overseas:errors.required',
    }),
    r.inArray.make({
      source: ['yes', 'no'],
      errorMsg: 'military-overseas:errors.required',
    }),
  ]),
];
