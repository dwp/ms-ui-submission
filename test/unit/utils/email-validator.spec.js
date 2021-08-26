const { assert } = require('chai');
const { validateEmail } = require('../../../app/utils/email-validator.js');

describe('email-validator', () => {
  it('Returns true for simple email address', () => {
    assert.isTrue(validateEmail('email@domain.com'));
  });

  it('Returns true for simple email address with capitalised top level domain', () => {
    assert.isTrue(validateEmail('email@domain.COM'));
  });

  it('Returns true for email address with a full stop in the username', () => {
    assert.isTrue(validateEmail('firstname.lastname@domain.com'));
  });

  it('Returns true for email address with a apostrophe in the username', () => {
    assert.isTrue(validateEmail('firstname.o\'lastname@domain.com'));
  });

  it('Returns true for email address with a apostrophe in the username', () => {
    assert.isTrue(validateEmail('firstname.o\'lastname@domain.com'));
  });

  it('Returns true for email address with a subdomain', () => {
    assert.isTrue(validateEmail('email@subdomain.domain.com'));
  });

  it('Returns true for email address with a + in username', () => {
    assert.isTrue(validateEmail('firstname+lastname@domain.com'));
  });

  it('Returns true for email address with numbers in username', () => {
    assert.isTrue(validateEmail('1234567890@domain.com'));
  });

  it('Returns true for email address with - in domain', () => {
    assert.isTrue(validateEmail('email@domain-one.com'));
  });

  it('Returns true for email address with _ in username', () => {
    assert.isTrue(validateEmail('_______@domain.com'));
  });

  it('Returns true for email address with an open top level domain', () => {
    assert.isTrue(validateEmail('email@domain.name'));
  });

  it('Returns true for email address with a long top level domain', () => {
    assert.isTrue(validateEmail('email@domain.superlongtld'));
  });

  it('Returns true for email address with a country code top level domain', () => {
    assert.isTrue(validateEmail('email@domain.co.jp'));
  });

  it('Returns true for email address with a - in the username', () => {
    assert.isTrue(validateEmail('firstname-lastname@domain.com'));
  });

  it('Returns true for email address with a diacritic in domain name', () => {
    assert.isTrue(validateEmail('info@german-financial-services.vermögensberatung'));
  });

  it('Returns true for email address with an extra long top level domain', () => {
    assert.isTrue(validateEmail('info@german-financial-services.reallylongarbitrarytldthatiswaytoohugejustincase'));
  });

  it('Returns true for email address with a internationalised domain (IDNA)', () => {
    assert.isTrue(validateEmail('japanese-info@例え.テスト'));
  });

  it('Returns true for email address with a contiguous full stop in username', () => {
    assert.isTrue(validateEmail('technically..valid@domain.com'));
  });

  it('Returns false for email address with an IP address for domain', () => {
    assert.isFalse(validateEmail('email@123.123.123.123'));
  });

  it('Returns false for email address with square brackets in domain', () => {
    assert.isFalse(validateEmail('email@[123.123.123.123]'));
  });

  it('Returns false for email address with no domain', () => {
    assert.isFalse(validateEmail('plainaddress'));
  });

  it('Returns false for email address with no username', () => {
    assert.isFalse(validateEmail('@no-local-part.com'));
  });

  it('Returns false for Outlook contact', () => {
    assert.isFalse(validateEmail('Outlook Contact <outlook-contact@domain.com>'));
  });

  it('Returns false for email address with no @', () => {
    assert.isFalse(validateEmail('no-at.domain.com'));
  });

  it('Returns false for email address with no top level domain', () => {
    assert.isFalse(validateEmail('no-tld@domain'));
  });

  it('Returns false for email address with semi colon at beginning or username', () => {
    assert.isFalse(validateEmail(';beginning-semicolon@domain.co.uk'));
  });

  it('Returns false for email address with semi colon in the middle of domain', () => {
    assert.isFalse(validateEmail('middle-semicolon@domain.co;uk'));
  });

  it('Returns false for email address with semi colon at the end of domain', () => {
    assert.isFalse(validateEmail('trailing-semicolon@domain.com;'));
  });

  it('Returns false for email address with double quote at start of username', () => {
    assert.isFalse(validateEmail('"email+leading-quotes@domain.com'));
  });

  it('Returns false for email address with double quote in the middle of username', () => {
    assert.isFalse(validateEmail('email+middle"-quotes@domain.com'));
  });

  it('Returns false for email address with username in double quotes', () => {
    assert.isFalse(validateEmail('"quoted-local-part"@domain.com'));
  });

  it('Returns false for email address with email address in double quotes', () => {
    assert.isFalse(validateEmail('"quoted@domain.com"'));
  });

  it('Returns false for email address with contiguous full stops in domain name', () => {
    assert.isFalse(validateEmail('lots-of-dots@domain..gov...uk'));
  });

  it('Returns false for email address with multiple domain names', () => {
    assert.isFalse(validateEmail('multiple@domains@domain.com'));
  });

  it('Returns false for email address with spaces in username', () => {
    assert.isFalse(validateEmail('spaces in local@domain.com'));
  });

  it('Returns false for email address with spaces in domain name', () => {
    assert.isFalse(validateEmail('spaces-in-domain@dom ain.com'));
  });

  it('Returns false for email address with _ in domain name', () => {
    assert.isFalse(validateEmail('underscores-in-domain@dom_ain.com'));
  });

  it('Returns false for email address with | in domain name', () => {
    assert.isFalse(validateEmail('pipe-in-domain@example.com|gov.uk'));
  });

  it('Returns false for email address with , in username', () => {
    assert.isFalse(validateEmail('comma,in-local@gov.uk'));
  });

  it('Returns false for email address with , in domain name', () => {
    assert.isFalse(validateEmail('comma-in-domain@domain,gov.uk'));
  });

  it('Returns false for email address with £ in username', () => {
    assert.isFalse(validateEmail('pound-sign-in-local£@domain.com'));
  });

  it('Returns false for email address with \' in username', () => {
    assert.isFalse(validateEmail('local-with-’-apostrophe@domain.com'));
  });

  it('Returns false for email address with " in username', () => {
    assert.isFalse(validateEmail('local-with-”-quotes@domain.com'));
  });

  it('Returns false for email address with full stop at start of domain', () => {
    assert.isFalse(validateEmail('domain-starts-with-a-dot@.domain.com'));
  });
});
