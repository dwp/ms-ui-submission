import chai, { assert, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import DateComponentsExist from '../../../../src/lib/validators/date-components-exist.js';

chai.use(chaiAsPromised);

const errorMsg = { inline: 'validation:rule.dateObject.inline', summary: 'validation:rule.dateObject.inline' };

describe('Date components exist validator', () => {
  it('should return an error if day field is empty', () => {
    const value = {
      dd: '',
      mm: '12',
      yyyy: '2012',
    };
    const validationResults = new DateComponentsExist().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if month field is empty', () => {
    const value = {
      dd: '12',
      mm: '',
      yyyy: '2012',
    };
    const validationResults = new DateComponentsExist().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if year field is empty', () => {
    const value = {
      dd: '12',
      mm: '12',
      yyyy: '',
    };
    const validationResults = new DateComponentsExist().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if day and month are empty', () => {
    const value = {
      dd: '',
      mm: '',
      yyyy: '2012',
    };
    const validationResults = new DateComponentsExist().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if day and year are empty', () => {
    const value = {
      dd: '',
      mm: '12',
      yyyy: '',
    };
    const validationResults = new DateComponentsExist().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if month and year are empty', () => {
    const value = {
      dd: '12',
      mm: '',
      yyyy: '',
    };
    const validationResults = new DateComponentsExist().validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should not return an error if full date provided', () => {
    const value = {
      dd: '12',
      mm: '12',
      yyyy: '2012',
    };
    const validationResults = new DateComponentsExist().validate(value);
    return expect(validationResults.length).to.eql(0);
  });
});
