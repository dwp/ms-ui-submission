const chai = require('chai');

const { assert } = chai;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

let dateIsReal;
const errorMsg = { inline: 'validation:rule.dateObject.inline', summary: 'validation:rule.dateObject.inline' };

describe('Date is real validator', () => {
  beforeEach(() => {
    dateIsReal = require('../../../../app/lib/validation-rules/date-is-real.js'); // eslint-disable-line
  });
  it('should return an error if day field contains an e', () => {
    const value = {
      dd: 'e',
      mm: '',
      yyyy: '',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error if month field contains an e', () => {
    const value = {
      dd: '',
      mm: 'e',
      yyyy: '',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error if year field contains an e', () => {
    const value = {
      dd: '',
      mm: '',
      yyyy: 'e',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error if day field contains negative number', () => {
    const value = {
      dd: '-12',
      mm: '12',
      yyyy: '2012',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error if month field contains negative number', () => {
    const value = {
      dd: '12',
      mm: '-12',
      yyyy: '2012',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error if year field contains negative number', () => {
    const value = {
      dd: '',
      mm: '',
      yyyy: '-2012',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error if day is not a real calendar day', () => {
    const value = {
      dd: '45',
      mm: '12',
      yyyy: '2018',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error if month is not a real calendar month', () => {
    const value = {
      dd: '12',
      mm: '34',
      yyyy: '2018',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should not return an error if full real calendar date provided', () => {
    const value = {
      dd: '12',
      mm: '12',
      yyyy: '2012',
    };
    return assert.isFulfilled(dateIsReal(value));
  });
  it('should return an error if month field is mar', () => {
    const value = {
      dd: '1',
      mm: 'mar',
      yyyy: '1998',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error if day contains a space', () => {
    const value = {
      dd: '1 ',
      mm: '09',
      yyyy: '1998',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error if month contains a space', () => {
    const value = {
      dd: '1',
      mm: '09 ',
      yyyy: '1998',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error if single digit month contains a space', () => {
    const value = {
      dd: '01',
      mm: ' 9',
      yyyy: '1998',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error if year contains a space', () => {
    const value = {
      dd: '1',
      mm: '09',
      yyyy: ' 1998',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error with a day greater than two digits', () => {
    const value = {
      dd: '100',
      mm: '12',
      yyyy: '2018',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error with a day of 0', () => {
    const value = {
      dd: '0',
      mm: '12',
      yyyy: '2018',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error with a month greater than two digits', () => {
    const value = {
      dd: '10',
      mm: '120',
      yyyy: '2018',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error with a month of 0', () => {
    const value = {
      dd: '10',
      mm: '0',
      yyyy: '2018',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error with a day of just spaces', () => {
    const value = {
      dd: '   ',
      mm: '10',
      yyyy: '2018',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error with a year of 0000', () => {
    const value = {
      dd: '10',
      mm: '10',
      yyyy: '0000',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error with a blank day', () => {
    const value = {
      dd: '',
      mm: '10',
      yyyy: '1998',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error with a blank month', () => {
    const value = {
      dd: '10',
      mm: '',
      yyyy: '1998',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
  it('should return an error with a blank year', () => {
    const value = {
      dd: '10',
      mm: '10',
      yyyy: '',
    };
    return assert.isRejected(dateIsReal(value), errorMsg);
  });
});
