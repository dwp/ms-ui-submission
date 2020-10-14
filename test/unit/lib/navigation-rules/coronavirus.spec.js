const chai = require('chai');
const sinon = require('sinon');

const { assert, expect } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const corona = require('../../../../app/lib/navigation-rules/coronavirus');

describe('coronavirus navigation rules', () => {
  let req;
  let deleteIfPresent;
  const page1 = 'coronavirus-reason-for-claim';
  const page2 = 'coronavirus-shielding';
  const page3 = 'coronavirus-date';
  const page4 = 'coronavirus-other-condition';
  const fieldNames1 = ['coronavirusReasonForClaim', 'otherReasonDetail'];
  const fieldNames2 = ['coronavirusShielding'];
  const fieldNames3 = ['coronavirusDate'];
  const fieldNames4 = ['coronavirusOtherCondition'];

  beforeEach(() => {
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    req = {};
  });

  afterEach(() => {
    deleteIfPresent.restore();
  });
  it('should empty all coronavirus related detail if coronavirus answer changed to no', () => {
    req.journeyData = {
      getDataForPage: () => ({
        coronavirusReasonForClaim: 'no',
      }),
    };
    corona(req);
    assert(deleteIfPresent.callCount === 4);
    expect(deleteIfPresent.getCall(0).args[0]).to.equal(req);
    expect(deleteIfPresent.getCall(0).args[1]).to.equal(page1);
    expect(deleteIfPresent.getCall(0).args[2]).to.eql(fieldNames1);
    expect(deleteIfPresent.getCall(1).args[1]).to.equal(page2);
    expect(deleteIfPresent.getCall(1).args[2]).to.eql(fieldNames2);
    expect(deleteIfPresent.getCall(2).args[1]).to.equal(page3);
    expect(deleteIfPresent.getCall(2).args[2]).to.eql(fieldNames3);
    expect(deleteIfPresent.getCall(3).args[1]).to.equal(page4);
    expect(deleteIfPresent.getCall(3).args[2]).to.eql(fieldNames4);
  });

  it('should not call deleteIfPresent if coronavirus answered as yes', () => {
    req.journeyData = {
      getDataForPage: () => ({
        coronavirusReasonForClaim: 'yes',
      }),
    };
    corona(req);
    assert(deleteIfPresent.notCalled);
  });
});
