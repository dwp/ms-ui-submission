import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Pregnant validator');

export default () => [
  field('pregnant').validators([
    r.required.make({
      errorMsg: 'pregnant:pregnant.errors.required',
    }),
  ]),
];
