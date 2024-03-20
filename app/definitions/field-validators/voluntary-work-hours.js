import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Voluntary work hours validator');

export default () => [
  field('sameHours').validators([
    r.required.make({
      errorMsg: 'voluntary-work-hours:sameHours.errors.required',
    }),
  ]),
  field('hours').validators([
    r.required.make({
      errorMsg: 'voluntary-work-hours:hours.errors.required',
    }),
    r.regex.make({
      pattern: /^\d{1,2}(\.\d)?$/,
      errorMsg: 'voluntary-work-hours:hours.errors.badFormat',
    }),
  ]).conditions([
    // Only validate the `hours` field if user selects yes
    ({ journeyContext: c, waypoint: w }) => c.data?.[w]?.sameHours === 'yes',
  ]),
];
