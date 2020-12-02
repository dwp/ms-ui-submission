const chai = require('chai');
const sinon = require('sinon');

const { assert, expect } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const employed = require('../../../../app/lib/navigation-rules/employed');

describe('employed navigation rules', () => {
  let req;
  let deleteIfPresent;
  const page1 = 'statutory-sick-pay-recent';
  const fieldNames1 = ['sspRecent'];

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
    assert(deleteIfPresent.calledOnce);
    expect(deleteIfPresent.getCall(0).args[0]).to.equal(req);
    expect(deleteIfPresent.getCall(0).args[1]).to.equal(page1);
    expect(deleteIfPresent.getCall(0).args[2]).to.eql(fieldNames1);
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
