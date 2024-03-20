import chai, { assert, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ValidateAccountNumber from '../../../../src/lib/validators/account-number-validator.js';

chai.use(chaiAsPromised);

describe('Account number validation', () => {
  it('returns resolved promise for a valid account number', () => {
    const fieldValue = '11111111';
    const validationResults = new ValidateAccountNumber().validate(fieldValue);
    return expect(validationResults.length).to.eql(0);
  });
  it('returns resolved promise for a valid account number with spaces', () => {
    const fieldValue = '11 111 1 11';
    const validationResults = new ValidateAccountNumber().validate(fieldValue);
    return expect(validationResults.length).to.eql(0);
  });
  it('returns rejected promise, with an appropriate error message, if invalid account number', () => {
    const fieldValue = '11 aa 11 11';
    const validationResults = new ValidateAccountNumber().validate(fieldValue);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, 'bank-details:accountNumber.errors.notNum');
  });
  it('returns rejected promise, with an appropriate error message, if account number not equal to 8 numbers', () => {
    const fieldValue = '11 1 11 11';
    const validationResults = new ValidateAccountNumber().validate(fieldValue);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, 'bank-details:accountNumber.errors.badLength');
  });
});
