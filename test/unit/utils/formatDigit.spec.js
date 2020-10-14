const chai = require('chai');

const { expect } = chai;
const formatDigit = require('../../../app/utils/formatDigit.js');

describe('format digit', () => {
  it('format date to format single digit to digit with leading zero', () => {
    const digit = '1';
    expect(formatDigit(digit)).to.equal('01');
  });
});
