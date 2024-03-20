import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Severe condition validator');

export default () => [
  field('severeCondition').validators([
    r.required.make({
      errorMsg: 'live-less-than-12-months:severeCondition.errors.required',
    }),
  ]),
];
