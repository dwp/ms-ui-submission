const chai = require('chai');

const { assert } = chai;

const { postcodeLookup } = require('../../../app/lib/postcode-lookup/postcode-lookup.js');

describe('Describe postcode lookup', () => {
  it('should return false for non-welsh postcode', () => {
    assert.equal(postcodeLookup('NE77GZ'), false);
  });
  it('should return true for welsh postcode', () => {
    assert.equal(postcodeLookup('CF11AM'), true);
  });
});
