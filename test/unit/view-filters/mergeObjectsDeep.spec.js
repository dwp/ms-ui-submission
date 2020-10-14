const chai = require('chai');

const { expect } = chai;

const mergeObjectsDeep = require('../../../app/view-filters/mergeObjectsDeep.js');

describe('merge objects', () => {
  it('should merge two objects to one if correct input is passed', () => {
    const objOne = { what: 'no' };
    const objTwo = { what: 'yes' };
    expect(mergeObjectsDeep(objOne, objTwo)).to.eql(objTwo);
  });

  it('should throw TypeError if string is provided', () => {
    const objOne = '1';
    const objTwo = '2';
    expect(() => mergeObjectsDeep(objOne, objTwo)).to.throw(TypeError, 'Cannot merge objects of type %s');
  });

  it('should throw Error if empty object is provided', () => {
    expect(() => mergeObjectsDeep()).to.throw(Error, 'You must specify some objects to merge');
  });
});
