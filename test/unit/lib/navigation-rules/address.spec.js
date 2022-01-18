const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const address = require('../../../../app/lib/navigation-rules/address');

describe('address navigation rules', () => {
  let req;
  let deleteIfPresent;
  const page = 'correspondence-address';
  const fieldNames = ['correspondenceAddress'];

  beforeEach(() => {
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    req = {};
  });

  afterEach(() => {
    deleteIfPresent.restore();
  });
  it('should empty correspondenceAddress if correspondence is changed to yes and non-welsh postcode', () => {
    req.journeyData = {
      getDataForPage: () => ({
        correspondence: 'yes',
        address: {
          postcode: 'NE77GZ',
        },
      }),
      setDataForPage: sinon.stub(),
    };
    address(req);
    assert(deleteIfPresent.calledThrice);
    assert(deleteIfPresent.calledWith(req, page, fieldNames));
  });
  it('should empty correspondenceAddress if correspondence is changed to yes and welsh postcode', () => {
    req.journeyData = {
      getDataForPage: () => ({
        correspondence: 'yes',
        address: {
          postcode: 'CF11AM',
        },
      }),
      setDataForPage: sinon.stub(),
    };
    address(req);
    assert(deleteIfPresent.calledOnce);
    assert(deleteIfPresent.calledWith(req, page, fieldNames));
  });
  it('should not empty correspondenceAddress if correspondence is changed to no and non-welsh postcode', () => {
    req.journeyData = {
      getDataForPage: () => ({
        correspondence: 'no',
        address: {
          postcode: 'NE77GZ',
        },
      }),
      setDataForPage: sinon.stub(),
    };
    address(req);
    assert(deleteIfPresent.calledTwice);
  });

  it('should not empty correspondenceAddress if correspondence is changed to no and welsh postcode', () => {
    req.journeyData = {
      getDataForPage: () => ({
        correspondence: 'no',
        address: {
          postcode: 'CF11AM',
        },
      }),
      setDataForPage: sinon.stub(),
    };
    address(req);
    assert(deleteIfPresent.notCalled);
  });
});
