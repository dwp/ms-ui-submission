import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Another health condition fields validations');

export default () => [
  field('anotherCondition').validators([
    r.required.make({
      errorMsg: 'another-health-condition:condition.errors.required',
    }),
    r.inArray.make({
      source: ['yes', 'no'],
      errorMsg: 'another-health-condition:condition.errors.required',
    }),
  ]).conditions([
    // Only validate the `anotherCondition` field if user has less than 12 conditions
    ({ journeyContext: c, waypoint: w }) => c.data?.[w]?.limitReached === 'no',
  ]),
  field('limitReached').validators([
    r.inArray.make({
      source: ['yes', 'no'],
    }),
  ])
];
