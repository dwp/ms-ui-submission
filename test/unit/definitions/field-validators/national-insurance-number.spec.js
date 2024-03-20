import validators from '../../../../app/definitions/field-validators/national-insurance-number.js';

import expectValidatorDefault from '../../../../test/utils/validator-assertions.js';

const { expectValidatorToPass, expectValidatorToFail } = expectValidatorDefault;

describe('National insurance field validator', () => {
  describe('nino', () => {
    it('Passes when a valid nino is passed', async () => {
      await expectValidatorToPass(validators()[0], 'nino', 'nino', { nino: 'AA123456C' });
    });

    it('Passes when a valid nino with spaces is passed', async () => {
      await expectValidatorToPass(validators()[0], 'nino', 'nino', { nino: ' A A 1 2 3 4 5 6 C ' });
    });

    it('Fails when an invalid nino passed', async () => {
      await expectValidatorToFail(
        validators()[0],
        'nino',
        'nino',
        { nino: 'not a nino' },
        { summary: 'national-insurance-number:nino.errors.badFormat' },
      );
    });
  });
});
