const chai = require('chai');

const { expect } = chai;
const makeDeclaration = require('../../../../app/lib/data-mapper/makeDeclaration.js');

describe('setting up applicant data for submission', () => {
  const i18nTranslator = {
    t: () => this,
    getLanguage: () => 'en',
  };
  it('should build a declaration string', () => {
    const dec = makeDeclaration(i18nTranslator);
    expect(dec).to.be.a('string');
  });
});
