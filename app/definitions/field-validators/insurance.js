import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Insurance validator');

export default () => [
  field('insurance').validators(
    [
      r.required.make({
        errorMsg: 'insurance:insurance.errors.required',
      }),
      r.inArray.make({
        source: ['yes', 'no', 'notsure'],
        errorMsg: 'insurance:insurance.errors.required',
      }),
    ],
    (pageData) => pageData.screen === 'insurance',
    (pageData) => console.log('pageData', pageData)
  ),
  field('other').validators(
    [
      r.required.make({
        errorMsg: 'insurance:other.errors.required',
      }),
    ],
    (pageData) => pageData.screen === 'insurance-other',
  ).conditions([
    // Only validate the `other` field if screen field equal to `insurance-other`
    ({ journeyContext: c, waypoint: w }) => c.data?.[w]?.screen === 'insurance-other',
  ]),
  field('screen').validators([
    r.inArray.make({
      source: ['insurance', 'insurance-other'],
    }),
  ]),
];
