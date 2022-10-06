const chai = require('chai');

const { assert } = chai;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const validatePhoneNumber = require('../../../../app/lib/validation-rules/mobile-phone-number-validator.js');

describe('Phone number validation', () => {
  it('returns rejected promise, with an appropriate error message, for an invalid phone with +(0)', () => {
    const fieldValue = '+(0)9123 456789';
    return assert.isRejected(validatePhoneNumber(fieldValue), 'medical-centre:phoneNumber.errors.badFormat');
  });
  it('returns rejected promise, with an appropriate error message, for an invalid phone number', () => {
    const fieldValue = '+123&*456789+';
    return assert.isRejected(validatePhoneNumber(fieldValue), 'medical-centre:phoneNumber.errors.badFormat');
  });
  it('returns rejected promise, with an appropriate error message, for a number prefixed with +++', () => {
    const fieldValue = '+++ 01234 123456';
    return assert.isRejected(validatePhoneNumber(fieldValue), 'medical-centre:phoneNumber.errors.badFormat');
  });
  it('returns rejected promise, with an appropriate error message, for a number prefixed with ++', () => {
    const fieldValue = '++ 01234 123456';
    return assert.isRejected(validatePhoneNumber(fieldValue), 'medical-centre:phoneNumber.errors.badFormat');
  });
  it('returns resolved promise for a number that incorporates allowed hyphens/dashes', () => {
    const fieldValue = '++ 1-᠆‐-―﹘﹣－–3';
    return assert.isRejected(validatePhoneNumber(fieldValue), 'medical-centre:phoneNumber.errors.badFormat');
  });
  it('returns resolved promise for a number prefixed with +44', () => {
    const fieldValue = '+44 7752103495';
    return assert.isFulfilled(validatePhoneNumber(fieldValue));
  });
  it('returns resolved promise for a number prefixed without +', () => {
    const fieldValue = '07732103495';
    return assert.isFulfilled(validatePhoneNumber(fieldValue));
  });
  it('returns rejected promise, with an appropriate error message, for a uk landline number', () => {
    const fieldValue = '01933485938';
    return assert.isRejected(validatePhoneNumber(fieldValue), 'medical-centre:phoneNumber.errors.badFormat');
  });
  it('returns resolved promise for a US number', () => {
    const fieldValue = '+1-202-555-0173';
    return assert.isFulfilled(validatePhoneNumber(fieldValue));
  });
  it('returns resolved promise for a French mobile number', () => {
    const fieldValue = '+33-655-581-987';
    return assert.isFulfilled(validatePhoneNumber(fieldValue));
  });
  it('returns rejected promise, with an appropriate error message, for a french landline number', () => {
    const fieldValue = '+33 1 56 69 80 80';
    return assert.isRejected(validatePhoneNumber(fieldValue), 'medical-centre:phoneNumber.errors.badFormat');
  });
});
