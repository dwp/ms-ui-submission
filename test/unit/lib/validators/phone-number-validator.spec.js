import chai, { assert, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ValidatePhoneNumber from '../../../../src/lib/validators/phone-number-validator.js';

chai.use(chaiAsPromised);

describe('Phone number validation', () => {
  it('returns resolved promise for a valid phone number', () => {
    const fieldValue = '+(0)9123 456789';
    const validationResults = new ValidatePhoneNumber().validate(fieldValue);
    return expect(validationResults.length).to.eql(0);
  });
  it('returns rejected promise, with an appropriate error message, for an invalid phone number', () => {
    const fieldValue = '+123&*456789+';
    const validationResults = new ValidatePhoneNumber().validate(fieldValue);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, 'email:input.errors.badFormat');
  });
  it('returns rejected promise, with an appropriate error message, for a number prefixed with +++', () => {
    const fieldValue = '+++ 01234 123456';
    const validationResults = new ValidatePhoneNumber().validate(fieldValue);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, 'email:input.errors.badFormat');
  });
  it('returns resolved promise for a number prefixed with ++', () => {
    const fieldValue = '++ 01234 123456';
    const validationResults = new ValidatePhoneNumber().validate(fieldValue);
    return expect(validationResults.length).to.eql(0);
  });
  it('returns resolved promise for a number that incorporates allowed hyphens/dashes', () => {
    const fieldValue = '++ 1-᠆‐-―﹘﹣－–3';
    const validationResults = new ValidatePhoneNumber().validate(fieldValue);
    return expect(validationResults.length).to.eql(0);
  });
});
