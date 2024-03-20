import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('get-national-insurance-credits for claim validator');

export default () => [
  field('whatDoYouWantToDo').validators([
    r.required.make({
      errorMsg: 'get-national-insurance-credits:error',
    }),
  ]),
];
