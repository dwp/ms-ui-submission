import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Correspondence address field validations');

export default () => [
  field('correspondenceAddress[address1]').validators([
    r.required.make({
      errorMsg: 'address:errors.address1.required',
    }),
  ]),
  field('correspondenceAddress[postcode]').validators([
    r.required.make({
      errorMsg: 'address:errors.postcode.required',
    }),
  ]),
  field('correspondenceAddress').validators([
    r.postalAddressObject.make({
      requiredFields: ['address1', 'postcode'],
      altRegex: /^[^0-9]*$/,
      errorMsgAddress1: {
        summary: 'address:errors.address1.badFormat',
        focusSuffix: ['[address1]'],
      },
      errorMsgAddress2: {
        summary: 'address:errors.address2.badFormat',
        focusSuffix: ['[address2]'],
      },
      errorMsgAddress3: {
        summary: 'address:errors.address3.badFormat',
        focusSuffix: ['[address3]'],
      },
      errorMsgPostcode: {
        summary: 'address:errors.postcode.badFormat',
        focusSuffix: ['[postcode]'],
      },
    }),
  ]),
];
