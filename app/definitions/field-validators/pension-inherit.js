import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Pension inherit validator');

export default () => [
  field('pensionInherit').validators([
    r.required.make({
      errorMsg: 'pension-inherit:pensionInherit.errors.required',
    }),
    r.inArray.make({
      source: ['yes', 'no', 'notsure'],
      errorMsg: 'pension-inherit:pensionInherit.errors.required',
    }),
  ]),
];
