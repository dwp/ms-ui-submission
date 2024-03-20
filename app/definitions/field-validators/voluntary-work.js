import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Voluntary work validator');

export default () => [
  field('voluntaryWork').validators(
    [
      r.required.make({
        errorMsg: 'voluntary-work:voluntaryWork.errors.required',
      }),
    ],
    (pageData) => pageData.screen === 'voluntary-work',
  )
  .conditions([
    // Only validate the `employed` field if screen field equal to `voluntary-work`
    ({ journeyContext: c, waypoint: w }) => c.data?.[w]?.screen === 'voluntary-work',
  ]),
  field('other').validators(
    [
      r.required.make({
        errorMsg: 'voluntary-work:other.errors.required',
      }),
    ],
    (pageData) => pageData.screen === 'voluntary-work-other',
  )
  .conditions([
    // Only validate the `employed` field if screen field equal to `voluntary-work-other`
    ({ journeyContext: c, waypoint: w }) => c.data?.[w]?.screen === 'voluntary-work-other',
  ]),
  field('screen').validators([
    r.inArray.make({
      source: ['voluntary-work', 'voluntary-work-other'],
    }),
  ]),
];
