const chai = require('chai');

const { assert } = chai;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

let dateComponentsExist;
const errorMsg = { inline: 'validation:rule.dateObject.inline', summary: 'validation:rule.dateObject.inline' };

describe('Date components exist validator', () => {
  beforeEach(() => {
    dateComponentsExist = require('../../../../app/lib/validation-rules/date-components-exist.js'); // eslint-disable-line
  });
  it('should return an error if day field is empty', () => {
    const value = {
      dd: '',
      mm: '12',
      yyyy: '2012',
    };
    return assert.isRejected(dateComponentsExist(value), errorMsg);
  });
  it('should return an error if month field is empty', () => {
    const value = {
      dd: '12',
      mm: '',
      yyyy: '2012',
    };
    return assert.isRejected(dateComponentsExist(value), errorMsg);
  });
  it('should return an error if year field is empty', () => {
    const value = {
      dd: '12',
      mm: '12',
      yyyy: '',
    };
    return assert.isRejected(dateComponentsExist(value), errorMsg);
  });
  it('should return an error if day and month are empty', () => {
    const value = {
      dd: '',
      mm: '',
      yyyy: '2012',
    };
    return assert.isRejected(dateComponentsExist(value), errorMsg);
  });
  it('should return an error if day and year are empty', () => {
    const value = {
      dd: '',
      mm: '12',
      yyyy: '',
    };
    return assert.isRejected(dateComponentsExist(value), errorMsg);
  });
  it('should return an error if month and year are empty', () => {
    const value = {
      dd: '12',
      mm: '',
      yyyy: '',
    };
    return assert.isRejected(dateComponentsExist(value), errorMsg);
  });
  it('should not return an error if full date provided', () => {
    const value = {
      dd: '12',
      mm: '12',
      yyyy: '2012',
    };
    return assert.isFulfilled(dateComponentsExist(value));
  });
});
