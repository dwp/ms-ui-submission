import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Nino validator');

export default () => [
  field('nino').validators([
    r.nino.make({
      allowWhitespace: true,
      errorMsg: {
        summary: 'national-insurance-number:nino.errors.badFormat',
      },
    }),
  ]),
];
