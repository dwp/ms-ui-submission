import chai, { expect, assert } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ValidAccountName from '../../../../src/lib/validators/account-name-validator.js';

chai.use(chaiAsPromised);

describe('Account name validation', () => {
  it('returns resolved promise for a valid account name', () => {
    const fieldValue = 'Account Holder';
    return expect(new ValidAccountName().validate(fieldValue).length).to.eql(0);
  });
  it('returns rejected promise, with an appropriate error message, if there are consecutive spaces', () => {
    const fieldValue = 'Ac  ount Holder';
    const validationResults = new ValidAccountName().validate(fieldValue);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, 'bank-details:accountName.errors.consecSpaces');
  });
  it('returns rejected promise, with an appropriate error message, if there are consecutive special characters', () => {
    const fieldValue = 'Ac£&ount Holder';
    const validationResults = new ValidAccountName().validate(fieldValue);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, 'bank-details:accountName.errors.consecOther');
  });
  it('returns rejected promise, with an appropriate error message, if there are special characters at both the start and the end', () => {
    const fieldValue = '£Account Holder&';
    const validationResults = new ValidAccountName().validate(fieldValue);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, 'bank-details:accountName.errors.startAndEndFormat');
  });
  it('returns rejected promise, with an appropriate error message, if there is a special character at both the start and the end, with leading or trailing space', () => {
    const fieldValue = ' £Account Holder& ';
    const validationResults = new ValidAccountName().validate(fieldValue);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, 'bank-details:accountName.errors.startAndEndFormat');
  });
  it('returns rejected promise, with an appropriate error message, if there is a special character at the start', () => {
    const fieldValue = '£Account Holder';
    const validationResults = new ValidAccountName().validate(fieldValue);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, 'bank-details:accountName.errors.startFormat');
  });
  it('returns rejected promise, with an appropriate error message, if there is a special character at the start following leading space', () => {
    const fieldValue = ' £Account Holder';
    const validationResults = new ValidAccountName().validate(fieldValue);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, 'bank-details:accountName.errors.startFormat');
  });
  it('returns rejected promise, with an appropriate error message, if there is a special character at the end', () => {
    const fieldValue = 'Account Holder&';
    const validationResults = new ValidAccountName().validate(fieldValue);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, 'bank-details:accountName.errors.endFormat');
  });
  it('returns rejected promise, with an appropriate error message, if there is a special character at the end following trailing space', () => {
    const fieldValue = 'Account Holder& ';
    const validationResults = new ValidAccountName().validate(fieldValue);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, 'bank-details:accountName.errors.endFormat');
  });
});
