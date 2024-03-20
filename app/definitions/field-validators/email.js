import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';
import emailValidator from '../../../src/lib/validators/email-validator.js';

const appLogger = logger();
appLogger.info('Email fields validations');

export default () => [
  field('emailProvided').validators([
    r.inArray.make({
      source: ['yes', 'no'],
      errorMsg: 'email:radio.errors.required',
    }),
  ]),

  field('email').validators([
    r.required.make({ errorMsg: 'email:input.errors.required' }),
    emailValidator.make({ errorMsg: 'email:input.errors.badFormat' }),
  ]).conditions([
    // Only validate the `email` field if user selects yes
    ({ journeyContext: c, waypoint: w }) => c.data?.[w]?.emailProvided === 'yes',
  ]),
];
