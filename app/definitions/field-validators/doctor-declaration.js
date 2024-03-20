import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Doctor declaration fields validations');

export default () => [
  field('docShareWithDWP').validators([
    r.required.make({
      errorMsg: 'doctor-declaration:errors.required',
    }),
    r.inArray.make({
      source: ['yes', 'no'],
      errorMsg: 'doctor-declaration:errors.required',
    }),
  ]),
];
