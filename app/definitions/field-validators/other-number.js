import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';
import validatePhoneNumber from '../../../src/lib/validators/phone-number-validator.js';

const appLogger = logger();
appLogger.info('Other number validator');

export default () => [
  field('other').validators([
    r.required.make({
      errorMsg: 'other-number:other.errors.required',
    }),
  ]),
  field('number').validators(
    [
      r.required.make({
        errorMsg: 'other-number:number.errors.required',
      }),
      validatePhoneNumber.make({
        errorMsg: 'other-number:number.errors.badFormat',
      })
    ]).conditions([
      // Only validate the `mobile` field if user selects yes
      ({ journeyContext: c, waypoint: w }) => c.data?.[w]?.other === 'yes'
    ]),
];
