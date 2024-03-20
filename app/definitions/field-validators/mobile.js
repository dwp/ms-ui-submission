import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';
import mobilePhoneNumber from '../../../src/lib/validators/mobile-phone-number-validator.js';

const appLogger = logger();
appLogger.info('Mobile validator');

export default () => [
  field('mobile').validators([
    r.required.make({
      errorMsg: 'mobile:mobile.errors.required',
    }),
  ]),
  field('number').validators([
    r.required.make({
      errorMsg: 'mobile:number.errors.required',
    }),
    mobilePhoneNumber.make({
      errorMsg: 'mobile:number.errors.badFormat',
    }),
  ]).conditions([
    // Only validate the `mobile` field if user selects yes
    ({ journeyContext: c, waypoint: w }) => c.data?.[w]?.mobile === 'yes',
  ]),
];
