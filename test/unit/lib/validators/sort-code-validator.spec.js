import chai, { assert, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ValidateSortCode from '../../../../src/lib/validators/sort-code-validator.js';

chai.use(chaiAsPromised);

describe('Sort code validation', () => {
  it('returns resolved promise for a valid sort code', () => {
    const fieldValue = '111111';
    const validationResults = new ValidateSortCode().validate(fieldValue);
    return expect(validationResults.length).to.eql(0);
  });
  it('returns resolved promise for a valid sort code with spaces', () => {
    const fieldValue = '11 11 1 1';
    const validationResults = new ValidateSortCode().validate(fieldValue);
    return expect(validationResults.length).to.eql(0);
  });
  it('returns rejected promise, with an appropriate error message, if invalid sort code', () => {
    const fieldValue = '11 aa 11';
    const validationResults = new ValidateSortCode().validate(fieldValue);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, 'bank-details:sortCode.errors.notNum');
  });
  it('returns rejected promise, with an appropriate error message, if sort code not equal to 6 numbers', () => {
    const fieldValue = '11 1 1 1';
    const validationResults = new ValidateSortCode().validate(fieldValue);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, 'bank-details:sortCode.errors.badLength');
  });
});
