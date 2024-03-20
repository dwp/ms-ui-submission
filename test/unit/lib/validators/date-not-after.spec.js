import { DateTime } from 'luxon';
import chai, { assert, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import dateNotAfter from '../../../../src/lib/validators/date-not-after.js';

chai.use(chaiAsPromised);

// let dateNotAfter;
const errorMsg = { inline: 'validation:rule.dateObject.inline', summary: 'validation:rule.dateObject.inline' };
describe('Date not after validator', () => {
  const dateNotAfterValidation = dateNotAfter.make({ errorMsg });
  it('should return an error if value is after the default date', () => {
    const dateToCheck = DateTime.now().plus({ days: 1 }).startOf('day');
    const value = {
      dd: dateToCheck.day,
      mm: dateToCheck.month + 1,
      yyyy: dateToCheck.year.toString(),
    };
    const validationResults = dateNotAfterValidation.validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if value is after the dateToCheckAgainst provided', () => {
    const dateToCheck = DateTime.now().plus({ months: 1 }).startOf('day');
    const value = {
      dd: dateToCheck.day,
      mm: dateToCheck.month + 1,
      yyyy: dateToCheck.year.toString(),
    };
    const dateToCheckAgainst = () => DateTime.now().minus({ months: 1 });
    const dateNotAfterValidationAgainst = dateNotAfter.make({ errorMsg, dateToCheckAgainst });
    const validationResults = dateNotAfterValidationAgainst.validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should not return an error if value is today', () => {
    const dateToCheck = DateTime.now().startOf('day');
    const value = {
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    };
    const validationResults = dateNotAfterValidation.validate(value);
    return expect(validationResults.length).to.eql(0);
  });
  it('should not return an error if value is same as dateToCheckAgainst', () => {
    const dateToCheck = DateTime.now().plus({ months: 1 }).startOf('day');
    const value = {
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    };
    const dateToCheckAgainst = () => DateTime.now().plus({ months: 1 }).startOf('day');
    const dateNotAfterValidationAgainst = dateNotAfter.make({ errorMsg, dateToCheckAgainst });
    const validationResults = dateNotAfterValidationAgainst.validate(value);
    return expect(validationResults.length).to.eql(0);
  });
  it('should not return an error if value is before default date (today) ', () => {
    const dateToCheck = DateTime.now().minus({ months: 1 }).startOf('day');
    const value = {
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    };
    const validationResults = dateNotAfterValidation.validate(value);
    return expect(validationResults.length).to.eql(0);
  });
  it('should not return an error if value is before dateToCheckAgainst', () => {

    const dateToCheck = DateTime.now().minus({ months: 1 }).startOf('day');
    const value = {
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    };
    const dateToCheckAgainst = () => DateTime.now().plus({ months: 1 }).startOf('day');
    const dateNotAfterValidationAgainst = dateNotAfter.make({ errorMsg, dateToCheckAgainst });
    const validationResults = dateNotAfterValidationAgainst.validate(value);
    return expect(validationResults.length).to.eql(0);
  });
});
