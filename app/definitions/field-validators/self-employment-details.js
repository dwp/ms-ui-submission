import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';
import validateSpecialChar from '../../../src/lib/validators/special-char-validator.js';
import validatePhoneNumber from '../../../src/lib/validators/phone-number-validator.js';

const appLogger = logger();
appLogger.info('Self employment details validator');

export default () => [
  field('jobTitle').validators([
    r.required.make({
      errorMsg: 'self-employment-details:jobTitle.errors.required',
    }),
  ]),
  field('employerName').validators([
    r.required.make({
      errorMsg: 'self-employment-details:employerName.errors.required',
    }),
  ]),
  field('employerAddress[address1]').validators([
    r.required.make({
      errorMsg: 'self-employment-details:employerAddress.address1.errors.required',
    }),
  ]),
  field('employerAddress[address3]').validators([
    r.required.make({
      errorMsg: 'self-employment-details:employerAddress.address3.errors.required',
    }),
  ]),
  field('employerAddress[postcode]').validators([
    r.required.make({
      errorMsg: 'self-employment-details:postcode.errors.required',
    }),
  ]),
  field('employerAddress').validators([
    r.postalAddressObject.make({
      requiredFields: ['address1', 'address3', 'postcode'],
      errorMsgAddress1: {
        inline: 'self-employment-details:employerAddress.address1.errors.badFormat',
        summary: 'self-employment-details:employerAddress.address1.errors.badFormat',
        focusSuffix: '[address1]',
      },
      errorMsgAddress2: {
        inline: 'self-employment-details:employerAddress.address2.errors.badFormat',
        summary: 'self-employment-details:employerAddress.address2.errors.badFormat',
        focusSuffix: '[address2]',
      },
      errorMsgAddress3: {
        inline: 'self-employment-details:employerAddress.address3.errors.badFormat',
        summary: 'self-employment-details:employerAddress.address3.errors.badFormat',
        focusSuffix: '[address3]',
      },
      errorMsgPostcode: {
        summary: 'self-employment-details:postcode.errors.badFormat',
        focusSuffix: '[postcode]',
      },
      altRegex: /^[^0-9]*$/,
    }),
  ]),
  field('employerAddress[address1]').validators([
    validateSpecialChar.make({
      errorMsg: {
        summary: 'self-employment-details:employerAddress.address1.errors.badFormat',
        focusSuffix: '[address1]',
      },
    }),
  ]),
  field('employerAddress[address2]').validators([
    validateSpecialChar.make({
      errorMsg: {
        summary: 'self-employment-details:employerAddress.address2.errors.badFormat',
      },
      required: false,
    }),
  ]),
  field('employerAddress[address3]').validators([
    validateSpecialChar.make({
      errorMsg: {
        summary: 'self-employment-details:employerAddress.address3.errors.badFormat',
      },
    }),
  ]),
  field('employerTel').validators([
    r.required.make({
      errorMsg: 'self-employment-details:employerTel.errors.required',
    }),
    validatePhoneNumber.make({
      errorMsg: 'self-employment-details:employerTel.errors.badFormat',
    }),
  ]),
];
