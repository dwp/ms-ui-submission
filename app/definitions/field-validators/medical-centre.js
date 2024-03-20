import { validators as r } from '@dwp/govuk-casa';
import field from '../../../src/lib/field.js';
import logger from '../../../src/lib/logger.js';
import validateSpecialChar from '../../../src/lib/validators/special-char-validator.js';
import validatePhoneNumber from '../../../src/lib/validators/phone-number-validator.js';

const appLogger = logger();
appLogger.info('Medical centre validator');

export default () => [
  field('name').validators([
    r.required.make({
      errorMsg: 'medical-centre:name.errors.required',
    }),
  ]),
  field('address[address1]').validators([
    r.required.make({
      errorMsg: 'medical-centre:address.address1.errors.required',
    }),
  ]),
  field('address[address3]').validators([
    r.required.make({
      errorMsg: 'medical-centre:address.address3.errors.required',
    }),
  ]),
  field('address[postcode]').validators([
    r.required.make({
      errorMsg: 'medical-centre:postcode.errors.required',
    }),
  ]),
  field('address').validators([
    r.postalAddressObject.make({
      requiredField: ['address1', 'address3', 'postcode'],
      errorMsgAddress1: {
        inline: 'medical-centre:address.address1.errors.badFormat',
        summary: 'medical-centre:address.address1.errors.badFormat',
        focusSuffix: '[address1]',
      },
      errorMsgAddress2: {
        inline: 'medical-centre:address.address2.errors.badFormat',
        focusSuffix: '[address2]',
      },
      errorMsgAddress3: {
        inline: 'medical-centre:address.address3.errors.badFormat',
        summary: 'medical-centre:address.address3.errors.badFormat',
        focusSuffix: '[address3]',
      },
      errorMsgPostcode: {
        summary: 'medical-centre:postcode.errors.badFormat',
        focusSuffix: '[postcode]',
      },
    }),
  ]),
  field('address[address1]').validators([
    validateSpecialChar.make({
      errorMsg: {
        summary: 'medical-centre:address.address1.errors.badFormat',
        focusSuffix: '[address1]',
      },
    }),
  ]),
  field('address[address2]').validators([
    validateSpecialChar.make({
      errorMsg: {
        summary: 'medical-centre:address.address2.errors.badFormat',
      },
      required: false,
    }),
  ]),
  field('address[address3]').validators([
    validateSpecialChar.make({
      errorMsg: {
        summary: 'medical-centre:address.address3.errors.badFormat',
      },
    }),
  ]),
  field('phoneNumber').validators([
    r.required.make({
      errorMsg: 'medical-centre:phoneNumber.errors.required',
    }),
    validatePhoneNumber.make({
      errorMsg: {
        summary: 'medical-centre:phoneNumber.errors.badFormat',
      },
    }),
  ]),
  field('doctor', { optional: true }),
];
