const chai = require('chai');
const sinon = require('sinon');

const { assert, expect } = chai;
const viewFilters = require('../../../app/lib/view-filters.js');

describe('View filters', () => {
  it('should setup global functions and filters', () => {
    const filters = [];


    const filterFunc = (str, func) => {
      filters.push(str);
      if (str === 'date') {
        expect(func({ dd: '7', mm: '4', yyyy: '1981' })).to.equal('7 April 1981');
      } else {
        expect(func('daymonthyear')).to.equal(true);
      }
    };

    const addFilter = sinon.spy(filterFunc);

    const globalFunc = (str, func) => {
      filters.push(str);
      expect(func({ a: 1 }, { b: 2 })).to.eql({ a: 1, b: 2 });
      try {
        func();
      } catch (e) {
        expect(e).to.be.an('error');
      }
      try {
        func({}, []);
      } catch (e) {
        expect(e).to.be.an('error');
      }
    };

    const addGlobal = sinon.spy(globalFunc);

    const app = {
      get: sinon.stub().returns({ addFilter, addGlobal }),
    };

    viewFilters(app);

    sinon.assert.callCount(app.get, 8);
    sinon.assert.calledOnce(addGlobal);
    sinon.assert.callCount(addFilter, 7);

    expect(addGlobal.getCall(0).args[0]).to.equal('mergeObjectsDeep');
    expect(addFilter.getCall(0).args[0]).to.equal('matchDay');
    expect(addFilter.getCall(1).args[0]).to.equal('matchMonth');
    expect(addFilter.getCall(2).args[0]).to.equal('matchYear');
    expect(addFilter.getCall(3).args[0]).to.equal('includesDay');
    expect(addFilter.getCall(4).args[0]).to.equal('includesMonth');
    expect(addFilter.getCall(5).args[0]).to.equal('includesYear');
    expect(addFilter.getCall(6).args[0]).to.equal('date');
  });
});
