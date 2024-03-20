import chai, { assert, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import validatePhoneNumber from '../../../../src/lib/validators/mobile-phone-number-validator.js';

chai.use(chaiAsPromised);

let validatePhoneNumberValidation;
const errorMsg = { inline: 'mobile:phoneNumber.errors.badFormat', summary: 'mobile:phoneNumber.errors.badFormat' };

describe('Phone number validation', () => {
  beforeEach(() => {
    validatePhoneNumberValidation = validatePhoneNumber.make({ errorMsg });
  });
  it('returns rejected promise, with an appropriate error message, for an invalid phone with +(0)', () => {
    const fieldValue = '+(0)9123 456789';
    const validationResults = validatePhoneNumberValidation.validate(fieldValue);
    expect(validationResults.length).to.eql(1);

    return assert.deepEqual(validationResults[0].summary, errorMsg.summary);
  });
  it('returns rejected promise, with an appropriate error message, for an invalid phone number', () => {
    const fieldValue = '+123&*456789+';
    const validationResults = validatePhoneNumberValidation.validate(fieldValue);
    expect(validationResults.length).to.eql(1);

    return assert.deepEqual(validationResults[0].summary, errorMsg.summary);
  });
  it('returns rejected promise, with an appropriate error message, for a number prefixed with +++', () => {
    const fieldValue = '+++ 01234 123456';
    const validationResults = validatePhoneNumberValidation.validate(fieldValue);
    expect(validationResults.length).to.eql(1);

    return assert.deepEqual(validationResults[0].summary, errorMsg.summary);
  });
  it('returns rejected promise, with an appropriate error message, for a number prefixed with ++', () => {
    const fieldValue = '++ 01234 123456';
    const validationResults = validatePhoneNumberValidation.validate(fieldValue);
    expect(validationResults.length).to.eql(1);

    return assert.deepEqual(validationResults[0].summary, errorMsg.summary);
  });
  it('returns resolved promise for a number that incorporates allowed hyphens/dashes', () => {
    const fieldValue = '++ 1-᠆‐-―﹘﹣－–3';
    const validationResults = validatePhoneNumberValidation.validate(fieldValue);
    expect(validationResults.length).to.eql(1);

    return assert.deepEqual(validationResults[0].summary, errorMsg.summary);
  });
  it('returns resolved promise for a number prefixed with +44', () => {
    const fieldValue = '+44 7752103495';
    const validationResults = validatePhoneNumberValidation.validate(fieldValue);
    return expect(validationResults.length).to.eql(0);
  });
  it('returns resolved promise for a number prefixed without +', () => {
    const fieldValue = '07732103495';
    const validationResults = validatePhoneNumberValidation.validate(fieldValue);
    return expect(validationResults.length).to.eql(0);
  });
  it('returns rejected promise, with an appropriate error message, for a uk landline number', () => {
    const fieldValue = '01933485938';
    const validationResults = validatePhoneNumberValidation.validate(fieldValue);
    expect(validationResults.length).to.eql(1);

    return assert.deepEqual(validationResults[0].summary, errorMsg.summary);
  });
  it('returns resolved promise for a US number', () => {
    const fieldValue = '+1-202-555-0173';
    const validationResults = validatePhoneNumberValidation.validate(fieldValue);
    return expect(validationResults.length).to.eql(0);
  });
  it('returns resolved promise for a French mobile number', () => {
    const fieldValue = '+33-655-581-987';
    const validationResults = validatePhoneNumberValidation.validate(fieldValue);
    return expect(validationResults.length).to.eql(0);
  });
  it('returns rejected promise, with an appropriate error message, for a french landline number', () => {
    const fieldValue = '+33 1 56 69 80 80';
    const validationResults = validatePhoneNumberValidation.validate(fieldValue);
    expect(validationResults.length).to.eql(1);

    return assert.deepEqual(validationResults[0].summary, errorMsg.summary);
  });
});
