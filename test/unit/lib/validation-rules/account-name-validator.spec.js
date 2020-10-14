const chai = require('chai');

const { assert } = chai;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const validAccountName = require('../../../../app/lib/validation-rules/account-name-validator.js');

describe('Account name validation', () => {
  it('returns resolved promise for a valid account name', () => {
    const fieldValue = 'Account Holder';
    return assert.isFulfilled(validAccountName(fieldValue));
  });
  it('returns rejected promise, with an appropriate error message, if there are consecutive spaces', () => {
    const fieldValue = 'Ac  ount Holder';
    return assert.isRejected(validAccountName(fieldValue), 'bank-details:accountName.errors.consecSpaces');
  });
  it('returns rejected promise, with an appropriate error message, if there are consecutive special characters', () => {
    const fieldValue = 'Ac£&ount Holder';
    return assert.isRejected(validAccountName(fieldValue), 'bank-details:accountName.errors.consecOther');
  });
  it('returns rejected promise, with an appropriate error message, if there are special characters at both the start and the end', () => {
    const fieldValue = '£Account Holder&';
    return assert.isRejected(validAccountName(fieldValue), 'bank-details:accountName.errors.startAndEndFormat');
  });
  it('returns rejected promise, with an appropriate error message, if there is a special character at both the start and the end, with leading or trailing space', () => {
    const fieldValue = ' £Account Holder& ';
    return assert.isRejected(validAccountName(fieldValue), 'bank-details:accountName.errors.startAndEndFormat');
  });
  it('returns rejected promise, with an appropriate error message, if there is a special character at the start', () => {
    const fieldValue = '£Account Holder';
    return assert.isRejected(validAccountName(fieldValue), 'bank-details:accountName.errors.startFormat');
  });
  it('returns rejected promise, with an appropriate error message, if there is a special character at the start following leading space', () => {
    const fieldValue = ' £Account Holder';
    return assert.isRejected(validAccountName(fieldValue), 'bank-details:accountName.errors.startFormat');
  });
  it('returns rejected promise, with an appropriate error message, if there is a special character at the end', () => {
    const fieldValue = 'Account Holder&';
    return assert.isRejected(validAccountName(fieldValue), 'bank-details:accountName.errors.endFormat');
  });
  it('returns rejected promise, with an appropriate error message, if there is a special character at the end following trailing space', () => {
    const fieldValue = 'Account Holder& ';
    return assert.isRejected(validAccountName(fieldValue), 'bank-details:accountName.errors.endFormat');
  });
});
