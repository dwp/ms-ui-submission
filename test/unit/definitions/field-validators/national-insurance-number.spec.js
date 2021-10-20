const validators = require('../../../../app/definitions/field-validators/national-insurance-number');
const { expectValidatorToPass, expectValidatorToFail } = require('../../../utils/validator-assertions');

describe('National insurance field validator', () => {
  describe('nino', () => {
    it('Passes when a valid nino is passed', async () => {
      await expectValidatorToPass(validators, 'nino', 'nino', { nino: 'AA123456C' });
    });

    it('Passes when a valid nino with spaces is passed', async () => {
      await expectValidatorToPass(validators, 'nino', 'nino', { nino: ' A A 1 2 3 4 5 6 C ' });
    });

    it('Fails when an invalid nino passed', async () => {
      await expectValidatorToFail(validators, 'nino', 'nino', { nino: 'not a nino' },
        { summary: 'national-insurance-number:nino.errors.badFormat' });
    });
  });
});
