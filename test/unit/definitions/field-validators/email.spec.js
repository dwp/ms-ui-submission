import validators from '../../../../app/definitions/field-validators/email.js';
import expectValidatorDefault from '../../../utils/validator-assertions.js';

const { expectValidatorToPass, expectValidatorToFail } = expectValidatorDefault;


describe('Email field validator', () => {
  describe('emailProvided', () => {
    it('Passes when an answer is selected', async () => {
      await expectValidatorToPass(validators()[0], 'emailProvided', 'required', { emailProvided: 'yes' });
    });

    it('Fails when an answer isn\'t selected', async () => {
      await expectValidatorToFail(
        validators()[0],
        'emailProvided',
        'required',
        { emailProvided: '' },
        { summary: 'email:radio.errors.required' },
        'email',
      );
    });

    it('Passes when an answer of "yes" is selected', async () => {
      await expectValidatorToPass(validators()[0], 'emailProvided', 'inArray', { emailProvided: 'yes' });
    });

    it('Passes when an answer of "no" is selected', async () => {
      await expectValidatorToPass(validators()[0], 'emailProvided', 'inArray', { emailProvided: 'no' });
    });

    it('Fails when an invalid option is provided', async () => {
      await expectValidatorToFail(
        validators()[0],
        'emailProvided',
        'inArray',
        { emailProvided: 'not an option' },
        { summary: 'email:radio.errors.required' },
      );
    });
  });

  describe('email', () => {

    it('Passes when a string is entered', async () => {
      await expectValidatorToPass(validators()[1], 'email', 'required', { emailProvided: 'yes', email: 'username@domain.com' });
    });

    it('Fails when a string is not provided', async () => {
      const journeyContext = {};
      journeyContext.data = {};
      journeyContext.data.email = { emailProvided: 'yes', email: '' };
      await expectValidatorToFail(
        validators()[1],
        'email',
        'required',
        journeyContext,
        { summary: 'email:input.errors.required' },
        'email',
      );
    });

    it('Passes when a valid email is provided', async () => {
      const journeyContext = {};
      journeyContext.data = {};
      journeyContext.data.email = { emailProvided: 'yes', email: 'username@domain.com' };
      await expectValidatorToPass(validators()[1], 'email', 'email', journeyContext, 'email');
    });

    it('Fails when an invalid email is provided', async () => {
      const journeyContext = {};
      journeyContext.data = {};
      journeyContext.data.email = { emailProvided: 'yes', email: 'not an email' };
      await expectValidatorToFail(
        validators()[1],
        'email',
        'email',
        journeyContext,
        { summary: 'email:input.errors.badFormat' },
        'email',
      );
    });

    it('Passes when a valid email is provided', async () => {
      const journeyContext = {};
      journeyContext.data = {};
      journeyContext.data.email = { emailProvided: 'yes', email: 'username@domain.com' };
      await expectValidatorToPass(validators()[1], 'email', 'validateEmail', journeyContext, 'email');
    });

    it('Fails when an invalid email is provided', async () => {
      const journeyContext = {};
      journeyContext.data = {};
      journeyContext.data.email = { emailProvided: 'yes', email: 'email@[123.123.123.123]' },
      await expectValidatorToFail(
        validators()[1],
        'email',
        'validateEmail',
        journeyContext,
        { summary: 'email:input.errors.badFormat' },
        'email',
      );
    });
  });
});
