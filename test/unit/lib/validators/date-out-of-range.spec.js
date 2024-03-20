import { DateTime } from 'luxon';
import chai, { assert, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import dateOutOfRange from '../../../../src/lib/validators/date-out-of-range.js';

chai.use(chaiAsPromised);

let dateOutOfRangeValidation;
const errorMsg = { inline: 'validation:rule.dateObject.inline', summary: 'validation:rule.dateObject.inline' };

describe('Date out of range validator', () => {
  beforeEach(() => {
    dateOutOfRangeValidation = dateOutOfRange.make({ errorMsg });
  });
  it('should not return an error if value is between the two specified bound dates', () => {
    const dateToCheck = DateTime.now().startOf('day');
    const value = {
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    };
    const earliestDate = () => DateTime.now().minus({ days: 1 }).startOf('day');
    const latestDate = () => DateTime.now().plus({ days: 1 }).startOf('day');
    dateOutOfRangeValidation = dateOutOfRange.make({ errorMsg, earliestDate, latestDate });
    const validationResults = dateOutOfRangeValidation.validate(value);
    return expect(validationResults.length).to.eql(0);
  });
  it('should not return an error if value is between the default dates', () => {
    const dateToCheck = DateTime.now().startOf('day');
    const value = {
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    };
    const validationResults = dateOutOfRangeValidation.validate(value);
    return expect(validationResults.length).to.eql(0);
  });
  it('should not return an error if value is equal to default earliestDate', () => {
    const dateToCheck = DateTime.now().startOf('year').startOf('day');
    const value = {
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    };
    const validationResults = dateOutOfRangeValidation.validate(value);
    return expect(validationResults.length).to.eql(0);
  });
  it('should not return an error if value is equal to default latestDate', () => {
    const dateToCheck = DateTime.now().endOf('year').startOf('day');
    const value = {
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    };
    const validationResults = dateOutOfRangeValidation.validate(value);
    return expect(validationResults.length).to.eql(0);
  });
  it('should not return an error if value is equal to bound earliestDate', () => {
    const dateToCheck = DateTime.now().plus({ days: 1 }).startOf('day');
    const value = {
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    };
    const earliestDate = () => dateToCheck;
    dateOutOfRangeValidation = dateOutOfRange.make({ errorMsg, earliestDate });
    const validationResults = dateOutOfRangeValidation.validate(value);
    return expect(validationResults.length).to.eql(0);
  });
  it('should not return an error if value is equal to bound latestDate', () => {
    const dateToCheck = DateTime.now().plus({ days: 1 }).startOf('day');
    const value = {
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    };
    const latestDate = () => DateTime.now().plus({ days: 1 }).startOf('day');
    dateOutOfRangeValidation = dateOutOfRange.make({ errorMsg, latestDate });
    const validationResults = dateOutOfRangeValidation.validate(value);
    return expect(validationResults.length).to.eql(0);
  });
  it('should return an error if value is before the default earliestDate', () => {
    const dateToCheck = DateTime.now().minus({ years: 2 }).startOf('day');
    const value = {
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    };
    const validationResults = dateOutOfRangeValidation.validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if value is after the default latestDate', () => {
    const dateToCheck = DateTime.now().plus({ years: 2 }).startOf('day');
    const value = {
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    };
    const validationResults = dateOutOfRangeValidation.validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if value is before the bound earliestDate', () => {
    const dateToCheck = DateTime.now().minus({ years: 2 }).startOf('day');
    const value = {
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    };
    const earliestDate = () => DateTime.now().plus({ months: 1 }).startOf('day');
    dateOutOfRangeValidation = dateOutOfRange.make({ errorMsg, earliestDate });
    const validationResults = dateOutOfRangeValidation.validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if value is after the bound latestDate', () => {
    const dateToCheck = DateTime.now().plus({ years: 2 }).startOf('day');
    const value = {
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    };
    const latestDate = () => DateTime.now().plus({ months: 1 }).startOf('day');
    dateOutOfRangeValidation = dateOutOfRange.make({ errorMsg, latestDate });
    const validationResults = dateOutOfRangeValidation.validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
});
