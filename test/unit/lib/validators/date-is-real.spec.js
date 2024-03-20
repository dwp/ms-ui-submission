import chai, { assert, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import DateIsReal from '../../../../src/lib/validators/date-is-real.js';


chai.use(chaiAsPromised);
const errorMsg = { inline: 'validation:rule.dateObject.inline', summary: 'validation:rule.dateObject.inline' };

describe('Date is real validator', () => {
  it('should return an error if day field contains an e', () => {
    const value = {
      dd: 'e',
      mm: '',
      yyyy: '',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if month field contains an e', () => {
    const value = {
      dd: '',
      mm: 'e',
      yyyy: '',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if year field contains an e', () => {
    const value = {
      dd: '',
      mm: '',
      yyyy: 'e',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if day field contains negative number', () => {
    const value = {
      dd: '-2',
      mm: '12',
      yyyy: '2012',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if month field contains negative number', () => {
    const value = {
      dd: '12',
      mm: '-2',
      yyyy: '2012',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if year field contains negative number', () => {
    const value = {
      dd: '',
      mm: '',
      yyyy: '-2012',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if day is not a real calendar day', () => {
    const value = {
      dd: '45',
      mm: '12',
      yyyy: '2018',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if month is not a real calendar month', () => {
    const value = {
      dd: '12',
      mm: '34',
      yyyy: '2018',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should not return an error if full real calendar date provided', () => {
    const value = {
      dd: '12',
      mm: '12',
      yyyy: '2012',
    };
    const validationResults = new DateIsReal().validate(value);
    return expect(validationResults.length).to.eql(0);
  });
  it('should return an error if month field is mar', () => {
    const value = {
      dd: '1',
      mm: 'mar',
      yyyy: '1998',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if day contains a space', () => {
    const value = {
      dd: '1 ',
      mm: '09',
      yyyy: '1998',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if month contains a space', () => {
    const value = {
      dd: '1',
      mm: '09 ',
      yyyy: '1998',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if single digit month contains a space', () => {
    const value = {
      dd: '01',
      mm: ' 9',
      yyyy: '1998',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if year contains a space', () => {
    const value = {
      dd: '1',
      mm: '09',
      yyyy: ' 1998',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error with a day greater than two digits', () => {
    const value = {
      dd: '100',
      mm: '12',
      yyyy: '2018',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error with a day of 0', () => {
    const value = {
      dd: '0',
      mm: '12',
      yyyy: '2018',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error with a month greater than two digits', () => {
    const value = {
      dd: '10',
      mm: '120',
      yyyy: '2018',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error with a month of 0', () => {
    const value = {
      dd: '10',
      mm: '0',
      yyyy: '2018',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error with a day of just spaces', () => {
    const value = {
      dd: '   ',
      mm: '10',
      yyyy: '2018',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error with a year of 0000', () => {
    const value = {
      dd: '10',
      mm: '10',
      yyyy: '0000',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error with a blank day', () => {
    const value = {
      dd: '',
      mm: '10',
      yyyy: '1998',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error with a blank month', () => {
    const value = {
      dd: '10',
      mm: '',
      yyyy: '1998',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error with a blank year', () => {
    const value = {
      dd: '10',
      mm: '10',
      yyyy: '',
    };
    const validationResults = new DateIsReal().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
});
