const chai = require('chai');

const { assert } = chai;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const validateSpecialChar = require('../../../../app/lib/validation-rules/special-char-validator.js');

describe('Special char validation', () => {
  it('returns resolved promise for a valid field value', () => {
    const fieldValue = 'Bank Name';
    return assert.isFulfilled(validateSpecialChar(fieldValue));
  });
  it('returns rejected promise, with an appropriate error message, if there is any of these special character (< > /) anywhere', () => {
    const fieldValue = 'Bank < Name';
    return assert.isRejected(validateSpecialChar(fieldValue));
  });
});
