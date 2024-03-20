import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Employment hours validator');

export default () => [
  field('sameHours').validators([
    r.required.make({
      errorMsg: 'employment-hours:sameHours.errors.required',
    }),
    r.inArray.make({
      source: ['yes', 'no'],
      errorMsg: 'employment-hours:sameHours.errors.required',
    }),
  ]),
  field('hours').validators([
    r.required.make({
      errorMsg: 'employment-hours:hours.errors.required',
    }),
    r.regex.make({
      errorMsg: 'employment-hours:hours.errors.notNum',
      pattern: /^[0-9.]*$/,
    }),
    r.regex.make({
      errorMsg: 'employment-hours:hours.errors.badFormat',
      pattern: /^[0-9]{1,2}(\.[0-9])?$/,
    }),
  ]).conditions(
    [
    // Only validate the 'hours' field if user selects yes
      ({ journeyContext: c, waypoint: w }) => c.data?.[w]?.sameHours === 'yes',
    ],
    (pageData) => pageData.sameHours === 'yes',
  ),
];
