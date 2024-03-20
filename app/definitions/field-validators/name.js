import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Name validator');

export default () => [
  field('firstName').validators([
    r.required.make({
      errorMsg: 'name:firstName.errors.required',
    }),
    r.strlen.make({
      max: 50,
      errorMsgMax: 'name:firstName.errors.length',
    }),
  ]),
  field('lastName').validators([
    r.required.make({
      errorMsg: 'name:lastName.errors.required',
    }),
    r.strlen.make({
      max: 50,
      errorMsgMax: 'name:lastName.errors.length',
    }),
  ]),
];
