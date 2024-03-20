import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Pension validator');

export default () => [
  field('pension').validators(
    [
      r.required.make({
        errorMsg: 'pension:pension.errors.required',
      }),
      r.inArray.make({
        source: ['yes', 'no', 'notsure'],
        errorMsg: 'pension:pension.errors.required',
      }),
    ],
    (pageData) => pageData.screen === 'pension',
  ),
  field('other').validators(
    [
      r.required.make({
        errorMsg: 'pension:other.errors.required',
      }),
    ],
    (pageData) => pageData.screen === 'pension-other',
  ).conditions([
    // Only validate the `other` field if screen field equal to `pension-other`
    ({ journeyContext: c, waypoint: w }) => c.data?.[w]?.screen === 'pension-other',
  ]),
  field('screen').validators([
    r.inArray.make({
      source: ['pension', 'pension-other'],
    }),
  ]),
];
