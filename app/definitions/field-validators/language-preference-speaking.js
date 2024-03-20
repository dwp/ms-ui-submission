import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Language preference speaking validator');

export default () => [
  field('langPrefSpeaking').validators([
    r.required.make({
      errorMsg: 'language-preference-speaking:langPref.errors.required',
    }),
  ]),
];
