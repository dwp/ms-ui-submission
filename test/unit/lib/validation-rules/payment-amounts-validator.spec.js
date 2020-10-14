const chai = require('chai');

const { assert } = chai;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const validateAmounts = require('../../../../app/lib/validation-rules/payment-amounts-validator.js');

describe('Payment amounts validation', () => {
  it('returns resolved promise if amount after deductions is less than amount before deductions', () => {
    const fieldValue = 'amountAfterDeductions';
    const dataContext = {
      pageData: {
        amountBeforeDeductions: '123',
        amountAfterDeductions: '120',
      },
    };
    return assert.isFulfilled(validateAmounts(fieldValue, dataContext));
  });
  it('returns rejected promise, with an appropriate error message, if amount after deductions is greater than amount before deductions', () => {
    const fieldValue = 'amountAfterDeductions';
    const dataContext = {
      pageData: {
        amountBeforeDeductions: '120',
        amountAfterDeductions: '125',
      },
    };
    return assert.isRejected(validateAmounts(fieldValue, dataContext), 'pension-payment:amountAfterDeductions.errors.notLessThan');
  });
  it('returns rejected promise, with an appropriate error message, if amount after deductions is equal to amount before deductions', () => {
    const fieldValue = 'amountAfterDeductions';
    const dataContext = {
      pageData: {
        amountBeforeDeductions: '120',
        amountAfterDeductions: '120',
      },
    };
    return assert.isRejected(validateAmounts(fieldValue, dataContext), 'pension-payment:amountAfterDeductions.errors.notLessThan');
  });
});
