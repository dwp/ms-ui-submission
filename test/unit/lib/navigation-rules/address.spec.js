const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const address = require('../../../../app/lib/navigation-rules/address');

describe('address navigation rules', () => {
  let req;
  let deleteIfPresent;
  const page = 'address';
  const fieldNames = ['correspondenceAddress'];

  beforeEach(() => {
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    req = {};
  });

  afterEach(() => {
    deleteIfPresent.restore();
  });
  it('should empty correspondenceAddress if correspondence is changed to yes', () => {
    req.journeyData = {
      getDataForPage: () => ({
        correspondence: 'yes',
      }),
    };
    address(req);
    assert(deleteIfPresent.calledOnce);
    assert(deleteIfPresent.calledWith(req, page, fieldNames));
  });
  it('should not empty correspondenceAddress if correspondence is changed to no', () => {
    req.journeyData = {
      getDataForPage: () => ({
        correspondence: 'no',
      }),
    };
    address(req);
    assert(deleteIfPresent.notCalled);
  });
});
