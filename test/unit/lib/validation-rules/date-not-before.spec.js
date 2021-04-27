const moment = require('moment');

const chai = require('chai');

const { assert } = chai;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

let dateNotBefore;
const errorMsg = { inline: 'validation:rule.dateObject.inline', summary: 'validation:rule.dateObject.inline' };

describe('Date not before validator', () => {
  beforeEach(() => {
    dateNotBefore = require('../../../../app/lib/validation-rules/date-not-before.js'); // eslint-disable-line
  });
  it('should return an error if value is before the default date', () => {
    const dateToCheck = moment().subtract(1, 'day').startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    return assert.isRejected(dateNotBefore(value), errorMsg);
  });
  it('should return an error if value is before the dateToCheckAgainst provided', () => {
    const dateToCheck = moment().subtract(1, 'day').startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    const dateToCheckAgainst = () => moment().add(1, 'month');
    dateNotBefore = dateNotBefore.bind({ dateToCheckAgainst });
    return assert.isRejected(dateNotBefore(value), errorMsg);
  });
  it('should not return an error if value is today', () => {
    const dateToCheck = moment().startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    return assert.isFulfilled(dateNotBefore(value));
  });
  it('should not return an error if value is same as dateToCheckAgainst', () => {
    const dateToCheck = moment().add(1, 'month').startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    const dateToCheckAgainst = () => moment().add(1, 'month').startOf('day');
    dateNotBefore = dateNotBefore.bind({ dateToCheckAgainst });
    return assert.isFulfilled(dateNotBefore(value));
  });
  it('should not return an error if value is after default date (today) ', () => {
    const dateToCheck = moment().add(1, 'month').startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    return assert.isFulfilled(dateNotBefore(value));
  });
  it('should not return an error if value is after dateToCheckAgainst', () => {
    const dateToCheck = moment().add(1, 'month').startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    const dateToCheckAgainst = () => moment().subtract(1, 'month').startOf('day');
    dateNotBefore = dateNotBefore.bind({ dateToCheckAgainst });
    return assert.isFulfilled(dateNotBefore(value));
  });
  it('should not return an error if claim-end-date is after claim-start-date', () => {
    const date = moment().startOf('day');
    const claimStartDate = JSON.stringify({
      dd: date.date(),
      mm: date.month(),
      yyyy: date.year(),
    });
    const dataContext = {
      fieldName: 'claimEndDate',
      pageData: {
        hiddenClaimStartDate: claimStartDate,
      },
    };
    const value = {
      dd: date.date(),
      mm: date.month() + 1,
      yyyy: date.year(),
    };
    return assert.isFulfilled(dateNotBefore(value, dataContext));
  });
  it('should return an error if claim-end-date is before claim-start-date', () => {
    const date = moment().startOf('day');
    const claimStartDate = JSON.stringify({
      dd: date.date(),
      mm: date.month(),
      yyyy: date.year(),
    });
    const dataContext = {
      fieldName: 'claimEndDate',
      pageData: {
        hiddenClaimStartDate: claimStartDate,
      },
    };
    const value = {
      dd: date.date(),
      mm: date.month() - 1,
      yyyy: date.year(),
    };
    return assert.isRejected(dateNotBefore(value, dataContext));
  });
  it('should not return an error if claim-start-date is after ssp-end-date', () => {
    const date = moment().startOf('day');
    const sspEndDate = JSON.stringify({
      dd: date.date(),
      mm: date.month(),
      yyyy: date.year(),
    });
    const dataContext = {
      fieldName: 'claimStartDate',
      pageData: {
        hiddenSspEndDate: sspEndDate,
      },
    };
    const value = {
      dd: date.date(),
      mm: date.month() + 1,
      yyyy: date.year(),
    };
    return assert.isFulfilled(dateNotBefore(value, dataContext));
  });
  it('should return an error if claim-start-date is before ssp-end-date', () => {
    const date = moment().startOf('day');
    const sspEndDate = JSON.stringify({
      dd: date.date(),
      mm: date.month(),
      yyyy: date.year(),
    });
    const dataContext = {
      fieldName: 'claimStartDate',
      pageData: {
        hiddenSspEndDate: sspEndDate,
      },
    };
    const value = {
      dd: date.date(),
      mm: date.month() - 1,
      yyyy: date.year(),
    };
    return assert.isRejected(dateNotBefore(value, dataContext));
  });
});
