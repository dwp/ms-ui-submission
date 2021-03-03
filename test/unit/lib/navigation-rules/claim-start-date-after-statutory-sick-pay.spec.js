const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const claimStartDateAfterSsp = require('../../../../app/lib/navigation-rules/claim-start-date-after-statutory-sick-pay');

describe('claim start date after ssp navigation rules', () => {
  let req;
  let deleteIfPresent;
  const page = 'claim-start-date';
  const fieldNames = ['claimStartDate'];

  beforeEach(() => {
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    req = {};
  });

  afterEach(() => {
    deleteIfPresent.restore();
  });
  it('should empty claimStartDate if claimStartDateAfterSsp is changed to yes', () => {
    req.journeyData = {
      getDataForPage: () => ({
        claimStartDateAfterSsp: 'yes',
      }),
    };
    claimStartDateAfterSsp(req);
    assert(deleteIfPresent.calledOnce);
    assert(deleteIfPresent.calledWith(req, page, fieldNames));
  });
  it('should not empty claimStartDate if claimEnd is changed to no', () => {
    req.journeyData = {
      getDataForPage: () => ({
        claimStartDateAfterSsp: 'no',
      }),
    };
    claimStartDateAfterSsp(req);
    assert(deleteIfPresent.notCalled);
  });
});
