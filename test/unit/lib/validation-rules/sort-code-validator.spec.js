const chai = require('chai');

const { assert } = chai;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const validateSortCode = require('../../../../app/lib/validation-rules/sort-code-validator.js');

describe('Sort code validation', () => {
  it('returns resolved promise for a valid sort code', () => {
    const fieldValue = '111111';
    return assert.isFulfilled(validateSortCode(fieldValue));
  });
  it('returns resolved promise for a valid sort code with spaces', () => {
    const fieldValue = '11 11 1 1';
    return assert.isFulfilled(validateSortCode(fieldValue));
  });
  it('returns rejected promise, with an appropriate error message, if invalid sort code', () => {
    const fieldValue = '11 aa 11';
    return assert.isRejected(validateSortCode(fieldValue), 'bank-details:sortCode.errors.notNum');
  });
  it('returns rejected promise, with an appropriate error message, if sort code not equal to 6 numbers', () => {
    const fieldValue = '11 1 1 1';
    return assert.isRejected(validateSortCode(fieldValue), 'bank-details:sortCode.errors.badLength');
  });
});
