import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import validateSpecialChar from '../../../src/lib/validators/special-char-validator.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Address fields validations');

export default () => [
  field('address[address1]').validators([
    r.required.make({
      errorMsg: 'address:errors.address1.required',
    }),
  ]),
  field('address[postcode]').validators([
    r.required.make({
      errorMsg: 'address:errors.postcode.required',
    }),
  ]),
  field('address').validators([
    r.postalAddressObject.make({
      requiredFields: ['address1', 'postcode'],
      strlenmax: 500,
      errorMsgAddress1: {
        inline: 'address:errors.address1.badFormat',
        summary: 'address:errors.address1.required',
        focusSuffix: '[address1]',
      },
      errorMsgAddress2: {
        inline: 'address:errors.address2.badFormat',
        summary: 'address:errors.address2.badFormat',
        focusSuffix: '[address2]',
      },
      errorMsgAddress3: {
        inline: 'address:errors.address3.badFormat',
        summary: 'address:errors.address3.badFormat',
        focusSuffix: '[address3]',
      },
      errorMsgPostcode: {
        inline: 'address:errors.postcode.badFormat',
        summary: 'address:errors.postcode.badFormat',
        focusSuffix: '[postcode]',
      },
    }),
  ]),
  field('address[address1]').validators([
    validateSpecialChar.make({
      errorMsg: {
        summary: 'address:errors.address1.badFormat',
        focusSuffix: '[address1]',
      },
    }),
  ]),
  field('address[address2]').validators([
    validateSpecialChar.make({
      errorMsg: {
        summary: 'address:errors.address2.badFormat',
      },
      required: false,
    }),
  ]),
  field('address[address3]').validators([
    validateSpecialChar.make({
      errorMsg: {
        summary: 'address:errors.address3.badFormat',
      },
    }),
  ]),
  field('correspondence').validators([
    r.required.make({
      errorMsg: 'address:correspondence.errors.required',
    }),
    r.inArray.make({
      source: ['yes', 'no'],
      errorMsg: 'address:correspondence.errors.required',
    }),
  ]),
];
