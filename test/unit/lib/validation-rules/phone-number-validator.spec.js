const chai = require('chai');

const { assert } = chai;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const validatePhoneNumber = require('../../../../app/lib/validation-rules/phone-number-validator.js');

describe('Phone number validation', () => {
  it('returns resolved promise for a valid phone number', () => {
    const fieldValue = '+(0)9123 456789';
    return assert.isFulfilled(validatePhoneNumber(fieldValue));
  });
  it('returns rejected promise, with an appropriate error message, for an invalid phone number', () => {
    const fieldValue = '+123&*456789+';
    return assert.isRejected(validatePhoneNumber(fieldValue), 'medical-centre:phoneNumber.errors.badFormat');
  });
  it('returns rejected promise, with an appropriate error message, for a number prefixed with +++', () => {
    const fieldValue = '+++ 01234 123456';
    return assert.isRejected(validatePhoneNumber(fieldValue), 'medical-centre:phoneNumber.errors.badFormat');
  });
  it('returns resolved promise for a number prefixed with ++', () => {
    const fieldValue = '++ 01234 123456';
    return assert.isFulfilled(validatePhoneNumber(fieldValue));
  });
  it('returns resolved promise for a number that incorporates allowed hyphens/dashes', () => {
    const fieldValue = '++ 1-᠆‐-―﹘﹣－–3';
    return assert.isFulfilled(validatePhoneNumber(fieldValue));
  });
});
