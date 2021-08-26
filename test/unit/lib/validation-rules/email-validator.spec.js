const rewire = require('rewire');
const { assert, ...chai } = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const validateEmail = rewire('../../../../app/lib/validation-rules/email-validator');

chai.use(chaiAsPromised);

const validateEmailStub = sinon.stub();
// eslint-disable-next-line no-underscore-dangle
validateEmail.__set__('validateEmail', validateEmailStub);


describe('Email Validation', () => {
  it('Promise resolves when email is valid', async () => {
    validateEmailStub.withArgs('email@domain.com').returns(true);

    await assert.isFulfilled(validateEmail.validateEmail('email@domain.com'));
  });

  it('Promise rejects when email is invalid', async () => {
    validateEmailStub.withArgs('not an email').returns(false);

    await assert.isRejected(validateEmail.validateEmail('not an email'));
  });

  it('Promise rejects with default reason when email is invalid', async () => {
    validateEmailStub.withArgs('not an email').returns(false);

    const actual = await assert.isRejected(validateEmail.validateEmail('not an email'));

    assert.deepEqual(actual, {
      inline: 'validation:rule.required.inline',
      summary: 'validation:rule.required.summary',
    });
  });

  it('Promise rejects with bound reason when email is invalid', async () => {
    validateEmailStub.withArgs('not an email').returns(false);

    const boundValidateEmail = validateEmail.validateEmail.bind({ errorMsg: 'email:input.errors.badFormat' });

    const actual = await assert.isRejected(boundValidateEmail('not an email'));

    assert.equal(actual, 'email:input.errors.badFormat');
  });
});
