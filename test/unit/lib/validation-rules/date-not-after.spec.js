const moment = require('moment');

const chai = require('chai');

const { assert } = chai;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

let dateNotAfter;
const errorMsg = { inline: 'validation:rule.dateObject.inline', summary: 'validation:rule.dateObject.inline' };
describe('Date not after validator', () => {
  beforeEach(() => {
    dateNotAfter = require('../../../../app/lib/validation-rules/date-not-after.js'); // eslint-disable-line
  });
  it('should return an error if value is after the default date', () => {
    const dateToCheck = moment().add(1, 'day').startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    dateNotAfter = dateNotAfter.bind({ errorMsg });
    return assert.isRejected(dateNotAfter(value), errorMsg);
  });
  it('should return an error if value is after the dateToCheckAgainst provided', () => {
    const dateToCheck = moment().add(1, 'month').startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    const dateToCheckAgainst = () => moment().subtract(1, 'month');
    dateNotAfter = dateNotAfter.bind({ errorMsg, dateToCheckAgainst });
    return assert.isRejected(dateNotAfter(value), errorMsg);
  });
  it('should not return an error if value is today', () => {
    const dateToCheck = moment().startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    return assert.isFulfilled(dateNotAfter(value));
  });
  it('should not return an error if value is same as dateToCheckAgainst', () => {
    const dateToCheck = moment().add(1, 'month').startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    const dateToCheckAgainst = () => moment().add(1, 'month').startOf('day');
    dateNotAfter = dateNotAfter.bind({ dateToCheckAgainst });
    return assert.isFulfilled(dateNotAfter(value));
  });
  it('should not return an error if value is before default date (today) ', () => {
    const dateToCheck = moment().subtract(1, 'month').startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    return assert.isFulfilled(dateNotAfter(value));
  });
  it('should not return an error if value is before dateToCheckAgainst', () => {
    const dateToCheck = moment().subtract(1, 'month').startOf('day');
    const value = {
      dd: dateToCheck.date(),
      mm: dateToCheck.month() + 1,
      yyyy: dateToCheck.year(),
    };
    const dateToCheckAgainst = () => moment().add(1, 'month').startOf('day');
    dateNotAfter = dateNotAfter.bind({ dateToCheckAgainst });
    return assert.isFulfilled(dateNotAfter(value));
  });
});
