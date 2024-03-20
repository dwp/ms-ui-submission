import chai, { assert, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import validateSpecialChar from '../../../../src/lib/validators/special-char-validator.js';

chai.use(chaiAsPromised);

describe('Special char validation', () => {
  const validateSpecial = validateSpecialChar.make({
    errorMsg: {
      summary: 'error',
    },
  }).validate;
  it('returns resolved promise for a valid field value', () => {
    const fieldValue = 'Bank Name';
    return expect(validateSpecial(fieldValue)).to.be.empty;
  });
  it('returns rejected promise, with an appropriate error message, if there is any of these special character (< > /) anywhere', () => {
    const fieldValue = 'Bank < Name';
    const validationResults = validateSpecial(fieldValue);
    expect(validationResults.length).to.eql(1);
    return assert.equal(validationResults[0].summary, 'error');
  });
});
