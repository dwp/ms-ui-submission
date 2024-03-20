import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Employed validator');

export default () => [
  field('employed').validators([
    r.required.make({
      errorMsg: 'employed:employed.errors.required',
    }),
    r.inArray.make({
      source: ['yes', 'no'],
      errorMsg: 'employed:employed.errors.required',
    }),
  ], (pageData) => pageData.screen === 'employed',)
    .conditions([
      // Only validate the `employed` field if screen field equal to `employed`
      ({ journeyContext: c, waypoint: w }) => c.data?.[w]?.screen === 'employed',
    ]),
  field('other').validators([
    r.required.make({
      errorMsg: 'employed:employed.errors.required',
    }),
    r.inArray.make({
      source: ['yes', 'no'],
      errorMsg: 'employed:employed.errors.required',
    }),
  ], (pageData) => pageData.screen === 'employed-other',)
  .conditions([
    // Only validate the `employed` field if screen field equal to `employed-other`
    ({ journeyContext: c, waypoint: w }) => c.data?.[w]?.screen === 'employed-other',
  ]),
  field('screen').validators([
    r.inArray.make({
      source: ['employed', 'employed-other'],
    }),
  ]),
];
