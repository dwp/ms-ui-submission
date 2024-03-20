import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('not-eligible-disability-or-health-condition validator');

export default () => [
  field('whatDoYouWantToDo').validators([
    r.required.make({
      errorMsg: 'not-eligible-disability-or-health-condition:error',
    }),
  ]),
];
