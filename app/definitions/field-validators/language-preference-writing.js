import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Language preference writing validator');

export default () => [
  field('langPrefWriting').validators([
    r.required.make({
      errorMsg: 'language-preference-writing:langPref.errors.required',
    }),
  ]),
];
