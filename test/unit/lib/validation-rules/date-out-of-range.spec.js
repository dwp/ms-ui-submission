const moment = require('moment');

const chai = require('chai');

const { assert } = chai;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

let dateOutOfRange;
const errorMsg = { inline: 'validation:rule.dateObject.inline', summary: 'validation:rule.dateObject.inline' };

describe('Date out of range validator', () => {
  beforeEach(() => {
    dateOutOfRange = require('../../../../app/lib/validation-rules/date-out-of-range.js'); // eslint-disable-line
  });
  it('should not return an error if value is between the two specified bound dates', () => {
    const dateToCheck = moment().startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    const earliestDate = () => moment().subtract(1, 'day').startOf('day');
    const latestDate = () => moment().add(1, 'day').startOf('day');
    dateOutOfRange = dateOutOfRange.bind({ earliestDate, latestDate });
    return assert.isFulfilled(dateOutOfRange(value));
  });
  it('should not return an error if value is between the default dates', () => {
    const dateToCheck = moment().startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    return assert.isFulfilled(dateOutOfRange(value));
  });
  it('should not return an error if value is equal to default earliestDate', () => {
    const dateToCheck = moment().startOf('year').startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    return assert.isFulfilled(dateOutOfRange(value));
  });
  it('should not return an error if value is equal to default latestDate', () => {
    const dateToCheck = moment().endOf('year').startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    return assert.isFulfilled(dateOutOfRange(value));
  });
  it('should not return an error if value is equal to bound earliestDate', () => {
    const dateToCheck = moment().add(1, 'day').startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    const earliestDate = () => moment().add(1, 'day').startOf('day');
    dateOutOfRange = dateOutOfRange.bind({ earliestDate });
    return assert.isFulfilled(dateOutOfRange(value));
  });
  it('should not return an error if value is equal to bound latestDate', () => {
    const dateToCheck = moment().add(1, 'day').startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    const latestDate = () => moment().add(1, 'day').startOf('day');
    dateOutOfRange = dateOutOfRange.bind({ latestDate });
    return assert.isFulfilled(dateOutOfRange(value));
  });
  it('should return an error if value is before the default earliestDate', () => {
    const dateToCheck = moment().subtract(2, 'years').startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    return assert.isRejected(dateOutOfRange(value), errorMsg);
  });
  it('should return an error if value is after the default latestDate', () => {
    const dateToCheck = moment().add(2, 'years').startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    return assert.isRejected(dateOutOfRange(value), errorMsg);
  });
  it('should return an error if value is before the bound earliestDate', () => {
    const dateToCheck = moment().subtract(2, 'years').startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    const earliestDate = () => moment().add(1, 'month').startOf('day');
    dateOutOfRange = dateOutOfRange.bind({ earliestDate });
    return assert.isRejected(dateOutOfRange(value), errorMsg);
  });
  it('should return an error if value is after the bound latestDate', () => {
    const dateToCheck = moment().add(2, 'years').startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    const latestDate = () => moment().add(1, 'month').startOf('day');
    dateOutOfRange = dateOutOfRange.bind({ latestDate });
    return assert.isRejected(dateOutOfRange(value), errorMsg);
  });
});
