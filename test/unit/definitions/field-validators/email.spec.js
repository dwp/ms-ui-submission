const validators = require('../../../../app/definitions/field-validators/email');
const { expectValidatorToPass, expectValidatorToFail } = require('../../../utils/validator-assertions');

describe('Email field validator', () => {
  describe('emailProvided', () => {
    it('Passes when an answer is selected', async () => {
      await expectValidatorToPass(validators, 'emailProvided', 'required', { emailProvided: 'yes' });
    });

    it('Fails when an answer isn\'t selected', async () => {
      await expectValidatorToFail(validators, 'emailProvided', 'required', { emailProvided: '' },
        { summary: 'email:radio.errors.required' });
    });

    it('Passes when an answer of "yes" is selected', async () => {
      await expectValidatorToPass(validators, 'emailProvided', 'inArray', { emailProvided: 'yes' });
    });

    it('Passes when an answer of "no" is selected', async () => {
      await expectValidatorToPass(validators, 'emailProvided', 'inArray', { emailProvided: 'no' });
    });

    it('Fails when an invalid option is provided', async () => {
      await expectValidatorToFail(validators, 'emailProvided', 'inArray', { emailProvided: 'not an option' },
        { summary: 'email:radio.errors.required' });
    });
  });

  describe('email', () => {
    it('Passes when a string is entered', async () => {
      await expectValidatorToPass(validators, 'email', 'required', { emailProvided: 'yes', email: 'username@domain.com' });
    });

    it('Fails when a string is not provided', async () => {
      await expectValidatorToFail(validators, 'email', 'required', { emailProvided: 'yes', email: '' },
        { summary: 'email:input.errors.required' });
    });

    it('Passes when a valid email is provided', async () => {
      await expectValidatorToPass(validators, 'email', 'email', { emailProvided: 'yes', email: 'username@domain.com' });
    });

    it('Fails when an invalid email is provided', async () => {
      await expectValidatorToFail(validators, 'email', 'email', { emailProvided: 'yes', email: 'not an email' },
        { summary: 'email:input.errors.badFormat' });
    });

    it('Passes when a valid email is provided', async () => {
      await expectValidatorToPass(validators, 'email', 'validateEmail', { emailProvided: 'yes', email: 'username@domain.com' });
    });

    it('Fails when an invalid email is provided', async () => {
      await expectValidatorToFail(validators, 'email', 'validateEmail', { emailProvided: 'yes', email: 'email@[123.123.123.123]' },
        { summary: 'email:input.errors.badFormat' });
    });
  });
});
