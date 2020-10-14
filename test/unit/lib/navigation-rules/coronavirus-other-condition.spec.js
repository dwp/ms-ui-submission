const chai = require('chai');
const sinon = require('sinon');

const { assert, expect } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const coronaCondition = require('../../../../app/lib/navigation-rules/coronavirus-other-condition');

describe('coronavirus-other-condition navigation rules', () => {
  let req;
  let deleteIfPresent;
  const page = 'conditions';
  const fieldName = ['conditions'];

  beforeEach(() => {
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    req = {};
  });

  afterEach(() => {
    deleteIfPresent.restore();
  });
  it('should empty conditions if coronavirus other conditions is no', () => {
    req.journeyData = {
      getDataForPage: () => ({
        coronavirusOtherCondition: 'no',
      }),
    };
    coronaCondition(req);
    assert(deleteIfPresent.calledOnce);
    expect(deleteIfPresent.getCall(0).args[0]).to.equal(req);
    expect(deleteIfPresent.getCall(0).args[1]).to.equal(page);
    expect(deleteIfPresent.getCall(0).args[2]).to.eql(fieldName);
  });
  it('should not empty conditions if coronavirusOtherCondition is yes', () => {
    req.journeyData = {
      getDataForPage: () => ({
        coronavirusOtherCondition: 'yes',
      }),
    };
    coronaCondition(req);
    assert(deleteIfPresent.notCalled);
  });
});
