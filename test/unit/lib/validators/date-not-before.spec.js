import { DateTime } from 'luxon';
import chai, { assert, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import dateNotBefore from '../../../../src/lib/validators/date-not-before.js';

chai.use(chaiAsPromised);

let dateNotBeforeValidation;
const errorMsg = { inline: 'validation:rule.dateObject.inline', summary: 'validation:rule.dateObject.inline' };

function dateCheck(date) {
  if (date.mm === '2' && date.dd > 28) {
    return {
      dd: 28,
      mm: date.mm,
      yyyy: date.yyyy,
    };
  }
  return date;
}

describe('Date not before validator', () => {
  beforeEach(() => {
    dateNotBeforeValidation = dateNotBefore.make({ errorMsg });
  });
  it('should return an error if value is before the default date', () => {
    const dateToCheck = DateTime.now().minus({ days: 1 }).startOf('day');
    const value = dateCheck({
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    });
    const validationResults = dateNotBeforeValidation.validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should return an error if value is before the dateToCheckAgainst provided', () => {
    const dateToCheck = DateTime.now().minus({ days: 1 }).startOf('day');
    const value = dateCheck({
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    });
    const dateToCheckAgainst = () => DateTime.now().plus({ months: 1 });
    dateNotBeforeValidation = dateNotBefore.make({ errorMsg, dateToCheckAgainst });
    const validationResults = dateNotBeforeValidation.validate(value);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should not return an error if value is today', () => {
    const dateToCheck = DateTime.now().startOf('day');
    const value = dateCheck({
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    });
    const validationResults = dateNotBeforeValidation.validate(value);
    return expect(validationResults.length).to.eql(0);
  });
  it('should not return an error if value is same as dateToCheckAgainst', () => {
    const dateToCheck = DateTime.now().plus({ months: 1 }).startOf('day');
    const value = dateCheck({
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    });
    const dateToCheckAgainst = () => DateTime.now().plus({ months: 1 }).startOf('day');
    dateNotBeforeValidation = dateNotBefore.make({ errorMsg, dateToCheckAgainst });
    const validationResults = dateNotBeforeValidation.validate(value);
    return expect(validationResults.length).to.eql(0);
  });
  it('should not return an error if value is after default date (today) ', () => {
    const dateToCheck = DateTime.now().plus({ months: 1 }).startOf('day');
    const value = dateCheck({
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    });
    const validationResults = dateNotBeforeValidation.validate(value);
    return expect(validationResults.length).to.eql(0);
  });
  it('should not return an error if value is after dateToCheckAgainst', () => {
    const dateToCheck = DateTime.now().plus({ months: 1 }).startOf('day');
    const value = dateCheck({
      dd: dateToCheck.day,
      mm: dateToCheck.month,
      yyyy: dateToCheck.year.toString(),
    });
    const dateToCheckAgainst = () => DateTime.now().minus({ months: 1 }).startOf('day');
    dateNotBeforeValidation = dateNotBefore.make({ errorMsg, dateToCheckAgainst });
    const validationResults = dateNotBeforeValidation.validate(value);
    return expect(validationResults.length).to.eql(0);
  });
  it('should not return an error if claim-end-date is after claim-start-date', () => {
    const date = DateTime.now().startOf('day');
    const claimStartDate = JSON.stringify({
      dd: date.day,
      mm: date.month,
      yyyy: date.year.toString(),
    });
    const dataContext = {
      fieldName: 'claimEndDate',
      journeyContext: {
        data: {
          'claim-end-date': {
            hiddenClaimStartDate: claimStartDate,
          },
        },
      },
    };
    const checkDate = DateTime.now().plus({ months: 1 }).startOf('day');
    const value = dateCheck({
      dd: checkDate.day,
      mm: checkDate.month,
      yyyy: checkDate.year.toString(),
    });
    const validationResults = dateNotBeforeValidation.validate(value, dataContext);
    return expect(validationResults.length).to.eql(0);
  });
  it('should return an error if claim-end-date is before claim-start-date', () => {
    const date = DateTime.now().startOf('day');
    const claimStartDate = JSON.stringify({
      dd: 1,
      mm: '02',
      yyyy: date,
    });
    const dataContext = {
      fieldName: 'claimEndDate',
      journeyContext: {
        data: {
          'claim-end-date': {
            hiddenClaimStartDate: claimStartDate,
          },
        },
      },
    };
    const value = dateCheck({
      dd: 1,
      mm: '01',
      yyyy: date.year.toString(),
    });
    const validationResults = dateNotBeforeValidation.validate(value, dataContext);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
  it('should not return an error if claim-start-date is after ssp-end-date', () => {
    const date = DateTime.now().startOf('day');
    const sspEndDate = JSON.stringify({
      dd: date.day,
      mm: date.month,
      yyyy: date.year.toString(),
    });
    const dataContext = {
      fieldName: 'claimStartDate',
      journeyContext: {
        data: {
          'claim-start-date': {
            hiddenSspEndDate: sspEndDate,
          },
        },
      },
    };
    const checkDate = DateTime.now().plus({ months: 1 }).startOf('day');
    const value = dateCheck({
      dd: checkDate.day,
      mm: checkDate.month,
      yyyy: checkDate.year.toString(),
    });
    const validationResults = dateNotBeforeValidation.validate(value, dataContext);
    return expect(validationResults.length).to.eql(0);
  });
  it('should return an error if claim-start-date is before ssp-end-date', () => {
    const date = DateTime.now().startOf('day');
    const sspEndDate = JSON.stringify({
      dd: 1,
      mm: '02',
      yyyy: date.year.toString(),
    });
    const dataContext = {
      fieldName: 'claimStartDate',
      journeyContext: {
        data: {
          'claim-start-date': {
            hiddenSspEndDate: sspEndDate,
          },
        },
      },
    };
    const value = dateCheck({
      dd: 1,
      mm: '01',
      yyyy: date.year.toString(),
    });
    const validationResults = dateNotBeforeValidation.validate(value, dataContext);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, errorMsg.summary);
  });
});
