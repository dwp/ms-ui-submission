const chai = require('chai');
const sinon = require('sinon');

const { assert, expect } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const employed = require('../../../../app/lib/navigation-rules/employed');

describe('employed navigation rules', () => {
  let req;
  let deleteIfPresent;
  const page1 = 'statutory-sick-pay-recent';
  const page2 = 'statutory-sick-pay-recent-end';
  const fieldNames1 = ['sspRecent'];
  const fieldNames2 = ['sspRecentEndDate'];

  beforeEach(() => {
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    req = {};
  });

  afterEach(() => {
    deleteIfPresent.restore();
  });
  it('should empty sspRecent details if employed is changed to yes', () => {
    req.journeyData = {
      getDataForPage: () => ({
        employed: 'yes',
      }),
    };
    employed(req);
    assert(deleteIfPresent.calledTwice);
    expect(deleteIfPresent.getCall(0).args[0]).to.equal(req);
    expect(deleteIfPresent.getCall(0).args[1]).to.equal(page1);
    expect(deleteIfPresent.getCall(0).args[2]).to.eql(fieldNames1);
    expect(deleteIfPresent.getCall(1).args[0]).to.equal(req);
    expect(deleteIfPresent.getCall(1).args[1]).to.equal(page2);
    expect(deleteIfPresent.getCall(1).args[2]).to.eql(fieldNames2);
  });
  it('should not empty sspRecent details if hospital-inpatient is changed to no', () => {
    req.journeyData = {
      getDataForPage: () => ({
        employed: 'no',
      }),
    };
    employed(req);
    assert(deleteIfPresent.notCalled);
  });
});
