import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import validateSpecialChar from '../../../src/lib/validators/special-char-validator.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Voluntary work details validator');

export default () => [
  field('organisationName').validators([
    r.required.make({
      errorMsg: 'voluntary-work-details:organisationName.errors.required',
    }),
  ]),
  field('organisationAddress[address1]').validators([
    r.required.make({
      errorMsg: 'voluntary-work-details:organisationAddress.address1.errors.required',
    }),
  ]),
  field('organisationAddress[address1]').validators([
    validateSpecialChar.make({
      errorMsg: {
        summary: 'voluntary-work-details:organisationAddress.address1.errors.badFormat',
        focusSuffix: '[address1]',
      },
    }),
  ]),
  field('organisationAddress[address2]').validators([
    validateSpecialChar.make({
      errorMsg: {
        summary: 'voluntary-work-details:organisationAddress.address2.errors.badFormat',
      },
      required: false,
    }),
  ]),
  field('organisationAddress[address3]').validators([
    validateSpecialChar.make({
      errorMsg: {
        summary: 'voluntary-work-details:organisationAddress.address3.errors.badFormat',
        focusSuffix: '[address3]',
      },
      required: false,
    }),
  ]),
  field('organisationAddress[postcode]').validators([
    r.required.make({
      errorMsg: 'voluntary-work-details:organisationAddress.postcode.errors.required',
    }),
  ]),
  field('organisationAddress').validators([
    r.postalAddressObject.make({
      requiredField: ['address1', 'postcode'],
      errorMsgAddress1: {
        inline: 'voluntary-work-details:organisationAddress.address1.errors.badFormat',
        summary: 'voluntary-work-details:organisationAddress.address1.errors.badFormat',
        focusSuffix: '[address1]',
      },
      errorMsgAddress2: {
        inline: 'voluntary-work-details:organisationAddress.address2.errors.badFormat',
        summary: 'voluntary-work-details:organisationAddress.address2.errors.badFormat',
      },
      errorMsgAddress3: {
        inline: 'voluntary-work-details:organisationAddress.address3.errors.badFormat',
        summary: 'voluntary-work-details:organisationAddress.address3.errors.badFormat',
        focusSuffix: '[address3]',
      },
      errorMsgPostcode: {
        summary: 'voluntary-work-details:organisationAddress.postcode.errors.badFormat',
        focusSuffix: '[postcode]',
      },
    }),
  ]),

];
