const chai = require('chai');

const { assert } = chai;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const validAccountNumber = require('../../../../app/lib/validation-rules/account-number-validator.js');

describe('Account number validation', () => {
  it('returns resolved promise for a valid account number', () => {
    const fieldValue = '11111111';
    return assert.isFulfilled(validAccountNumber(fieldValue));
  });
  it('returns resolved promise for a valid account number with spaces', () => {
    const fieldValue = '11 111 1 11';
    return assert.isFulfilled(validAccountNumber(fieldValue));
  });
  it('returns rejected promise, with an appropriate error message, if invalid account number', () => {
    const fieldValue = '11 aa 11 11';
    return assert.isRejected(validAccountNumber(fieldValue), 'bank-details:accountNumber.errors.notNum');
  });
  it('returns rejected promise, with an appropriate error message, if account number not equal to 8 numbers', () => {
    const fieldValue = '11 1 11 11';
    return assert.isRejected(validAccountNumber(fieldValue), 'bank-details:accountNumber.errors.badLength');
  });
});
