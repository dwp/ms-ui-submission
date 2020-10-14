const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const claimEndDate = require('../../../../app/lib/navigation-rules/claim-end-date');

describe('claim end date navigation rules', () => {
  let req;
  let deleteIfPresent;
  const page = 'claim-end-date';
  const fieldNames = ['claimEndDate'];

  beforeEach(() => {
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    req = {};
  });

  afterEach(() => {
    deleteIfPresent.restore();
  });
  it('should empty claimEndDate if claimEnd is changed to no', () => {
    req.journeyData = {
      getDataForPage: () => ({
        claimEnd: 'no',
      }),
    };
    claimEndDate(req);
    assert(deleteIfPresent.calledOnce);
    assert(deleteIfPresent.calledWith(req, page, fieldNames));
  });
  it('should not empty claimEndDate if claimEnd is changed to yes', () => {
    req.journeyData = {
      getDataForPage: () => ({
        claimEnd: 'yes',
      }),
    };
    claimEndDate(req);
    assert(deleteIfPresent.notCalled);
  });
});
