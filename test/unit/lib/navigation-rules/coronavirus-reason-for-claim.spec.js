const chai = require('chai');
const sinon = require('sinon');

const { assert, expect } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const corona = require('../../../../app/lib/navigation-rules/coronavirus-reason-for-claim');

describe('coronavirus-reason-for-claim navigation rules', () => {
  let req;
  let deleteIfPresent;
  const page1 = 'coronavirus-date';
  const page2 = 'coronavirus-other-condition';
  const page4 = 'coronavirus-shielding';
  const page5 = 'coronavirus-reason-for-claim';
  const fieldNames1 = ['coronavirusDate'];
  const fieldNames2 = ['coronavirusOtherCondition'];
  const fieldNames4 = ['coronavirusShielding'];
  const fieldNames5 = ['otherReasonDetail'];

  beforeEach(() => {
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    req = {};
  });

  afterEach(() => {
    deleteIfPresent.restore();
  });
  it('should empty coronavirusShielding, coronavirus-reason-for-claim, coronavirus-shielding and coronavirus-reason-for-claim details if coronavirus reason for claim is not high-risk', () => {
    req.journeyData = {
      getDataForPage: () => ({
        coronavirusReasonForClaim: 'self-isolation-contact',
      }),
    };
    corona(req);
    assert(deleteIfPresent.callCount === 4);
    expect(deleteIfPresent.getCall(0).args[0]).to.equal(req);
    expect(deleteIfPresent.getCall(0).args[1]).to.equal(page1);
    expect(deleteIfPresent.getCall(0).args[2]).to.eql(fieldNames1);
    expect(deleteIfPresent.getCall(1).args[1]).to.equal(page2);
    expect(deleteIfPresent.getCall(1).args[2]).to.eql(fieldNames2);
    expect(deleteIfPresent.getCall(2).args[1]).to.equal(page4);
    expect(deleteIfPresent.getCall(2).args[2]).to.eql(fieldNames4);
    expect(deleteIfPresent.getCall(3).args[1]).to.equal(page5);
    expect(deleteIfPresent.getCall(3).args[2]).to.eql(fieldNames5);
  });
  it('should empty coronavirusShielding, coronavirus-reason-for-claim and coronavirus-reason-for-claim details if coronavirus reason for claim is high-risk', () => {
    req.journeyData = {
      getDataForPage: () => ({
        coronavirusReasonForClaim: 'high-risk',
      }),
    };
    corona(req);
    assert(deleteIfPresent.callCount === 3);
    expect(deleteIfPresent.getCall(0).args[0]).to.equal(req);
    expect(deleteIfPresent.getCall(0).args[1]).to.equal(page1);
    expect(deleteIfPresent.getCall(0).args[2]).to.eql(fieldNames1);
    expect(deleteIfPresent.getCall(1).args[1]).to.equal(page2);
    expect(deleteIfPresent.getCall(1).args[2]).to.eql(fieldNames2);
    expect(deleteIfPresent.getCall(2).args[1]).to.equal(page5);
    expect(deleteIfPresent.getCall(2).args[2]).to.eql(fieldNames5);
  });
  it('should empty coronavirusShielding and coronavirus-reason-for-claim  if coronavirus reason for claim is other', () => {
    req.journeyData = {
      getDataForPage: () => ({
        coronavirusReasonForClaim: 'other',
      }),
    };
    corona(req);
    assert(deleteIfPresent.callCount === 3);
    expect(deleteIfPresent.getCall(0).args[0]).to.equal(req);
    expect(deleteIfPresent.getCall(0).args[1]).to.equal(page1);
    expect(deleteIfPresent.getCall(0).args[2]).to.eql(fieldNames1);
    expect(deleteIfPresent.getCall(1).args[1]).to.equal(page2);
    expect(deleteIfPresent.getCall(1).args[2]).to.eql(fieldNames2);
    expect(deleteIfPresent.getCall(2).args[1]).to.equal(page4);
    expect(deleteIfPresent.getCall(2).args[2]).to.eql(fieldNames4);
  });
});
