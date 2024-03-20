import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import isValidPhoneNumber from '../../../src/lib/validators/phone-number-validator.js';
import validateSpecialChar from '../../../src/lib/validators/special-char-validator.js';
import logger from '../../../src/lib/logger.js';

const appLogger = logger();
appLogger.info('Employment details validator');

export default () => [
  field('jobTitle').validators([
    r.required.make({
      errorMsg: 'employment-details:jobTitle.errors.required',
    }),
  ]),
  field('employerName').validators([
    r.required.make({
      errorMsg: 'employment-details:employerName.errors.required',
    }),
  ]),
  field('employerAddress[address1]').validators([
    r.required.make({
      errorMsg: 'employment-details:employerAddress.address1.errors.required',
    }),
  ]),
  field('employerAddress[address3]').validators([
    r.required.make({
      errorMsg: 'employment-details:employerAddress.address3.errors.required',
    }),
  ]),
  field('employerAddress[postcode]').validators([
    r.required.make({
      errorMsg: 'employment-details:postcode.errors.required',
    }),
  ]),
  field('employerAddress').validators([
    r.postalAddressObject.make({
      requiredField: ['address1', 'address3', 'postcode'],
      strlenmax: 500,
      errorMsgAddress1: {
        inline: 'employment-details:employerAddress.address1.errors.badFormat',
        summary: 'employment-details:employerAddress.address1.errors.badFormat',
        focusSuffix: '[address1]',
      },
      errorMsgAddress2: {
        inline: 'employment-details:employerAddress.address2.errors.badFormat',
        summary: 'employment-details:employerAddress.address2.errors.badFormat',
      },
      errorMsgAddress3: {
        inline: 'employment-details:employerAddress.address3.errors.badFormat',
        summary: 'employment-details:employerAddress.address3.errors.badFormat',
        focusSuffix: '[address3]',
      },
      errorMsgPostcode: {
        summary: 'employment-details:postcode.errors.badFormat',
        focusSuffix: '[postcode]',
      },
    }),
  ]),
  field('employerAddress[address1]').validators([
    validateSpecialChar.make({
      errorMsg: {
        summary: 'employment-details:employerAddress.address1.errors.badFormat',
        focusSuffix: '[address1]',
      },
    }),
  ]),
  field('employerAddress[address2]').validators([
    validateSpecialChar.make({
      errorMsg: {
        summary: 'employment-details:employerAddress.address2.errors.badFormat',
      },
      required: false,
    }),
  ]),
  field('employerAddress[address3]').validators([
    validateSpecialChar.make({
      errorMsg: {
        summary: 'employment-details:employerAddress.address3.errors.badFormat',
      },
    }),
  ]),
  field('employerTel').validators([
    r.required.make({
      errorMsg: 'employment-details:employerTel.errors.required',
    }),
    isValidPhoneNumber.make({
      errorMsg: 'employment-details:employerTel.errors.badFormat',
    }),
  ]),
];
