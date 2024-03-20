import chai, { assert, expect } from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import validateEmail from '../../../../src/lib/validators/email-validator.js';
import validateEmails from '../../../../app/utils/email-validator.js';

chai.use(chaiAsPromised);

let validateEmailValidation;
let validateEmailStub;
let sandbox;

const errorMsg = { inline: 'email:input.errors.badFormat', summary: 'email:input.errors.badFormat' };

describe('Email Validation', () => {

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    validateEmailStub = sandbox.stub(validateEmails, 'validateEmail').resolves();
    validateEmailValidation = validateEmail.make({ errorMsg });
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('Promise resolves when email is valid', async () => {

    validateEmailValidation = validateEmail.make({ errorMsg });
    const validationResults = validateEmailValidation.validate('email@domain.com');
    return expect(validationResults.length).to.eql(0);
  });

  it('Promise rejects when email is invalid', async () => {
    validateEmailStub.withArgs('not an email').returns(false);

    const validationResults = validateEmailValidation.validate('not an email');
    return expect(validationResults.length).to.eql(1);
  });

  it('Promise rejects with default reason when email is invalid', async () => {
    validateEmailStub.withArgs('not an email').returns(false);

    const validationResults = validateEmailValidation.validate('not an email');
    expect(validationResults.length).to.eql(1);

    return assert.deepEqual(validationResults[0].summary, errorMsg.summary);
  });

  it('Promise rejects with bound reason when email is invalid', async () => {
    validateEmailStub.withArgs('not an email').returns(false);

    const boundValidateEmail = validateEmail.make({ errorMsg: 'email:input.errors.badFormat' });

    const validationResults = boundValidateEmail.validate('not an email');

    assert.equal(validationResults[0].message, 'email:input.errors.badFormat');
  });
});
