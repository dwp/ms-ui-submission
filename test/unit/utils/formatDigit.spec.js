import { expect } from 'chai';
import formatDigitDefault from '../../../app/utils/formatDigit.js';
const formatDigit = formatDigitDefault;

describe('format digit', () => {
  it('format date to format single digit to digit with leading zero', () => {
    const digit = '1';
    expect(formatDigit(digit)).to.equal('01');
  });
});
