import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Voluntary work role validator');

export default () => [
  field('role').validators([
    r.required.make({
      errorMsg: 'voluntary-work-role:role.errors.required',
    }),
    r.strlen.make({
      max: 500,
      errorMsgMax: 'voluntary-work-role:role.errors.maxLength',
    }),
  ]),
];
