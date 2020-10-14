const chai = require('chai');

const { assert } = chai;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

let dateExists;
const errorMsg = { inline: 'validation:rule.dateObject.inline', summary: 'validation:rule.dateObject.inline' };

describe('Date exists validator', () => {
  beforeEach(() => {
    dateExists = require('../../../../app/lib/validation-rules/date-exists.js'); // eslint-disable-line
  });
  it('should return an error if all date fields are empty', () => {
    const value = {
      dd: '',
      mm: '',
      yyyy: '',
    };
    return assert.isRejected(dateExists(value), errorMsg);
  });
  it('should not return an error if day field provided', () => {
    const value = {
      dd: '12',
      mm: '',
      yyyy: '',
    };
    return assert.isFulfilled(dateExists(value));
  });
  it('should not return an error if month field provided', () => {
    const value = {
      dd: '',
      mm: '12',
      yyyy: '',
    };
    return assert.isFulfilled(dateExists(value));
  });
  it('should not return an error if year field provided', () => {
    const value = {
      dd: '',
      mm: '',
      yyyy: '2018',
    };
    return assert.isFulfilled(dateExists(value));
  });
  it('should not return an error if full date provided', () => {
    const value = {
      dd: '12',
      mm: '12',
      yyyy: '2012',
    };
    return assert.isFulfilled(dateExists(value));
  });
});
