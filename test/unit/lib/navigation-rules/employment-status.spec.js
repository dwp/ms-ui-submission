const chai = require('chai');
const sinon = require('sinon');

const { assert, expect } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const employmentStatus = require('../../../../app/lib/navigation-rules/employment-status');

describe('employment status navigation rules', () => {
  let req;
  let deleteIfPresent;
  const page1 = 'employment-details';

  beforeEach(() => {
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    req = {};
  });

  afterEach(() => {
    deleteIfPresent.restore();
  });
  it('should empty all employment data if selfEmployed is removed from employment-status', () => {
    req = {
      journeyData: {
        getDataForPage: () => ({
          workTypes: 'employed',
        }),
      },
      session: {
        isSelfEmployed: true,
      },
    };
    employmentStatus(req);
    assert(deleteIfPresent.callCount === 10);
    expect(deleteIfPresent.getCall(0).args[0]).to.equal(req);
    expect(deleteIfPresent.getCall(0).args[1]).to.equal(page1);
  });
  it('should empty all employment data if selfEmployed is added from employment-status', () => {
    req = {
      journeyData: {
        getDataForPage: () => ({
          workTypes: 'selfEmployed',
        }),
      },
      session: {
        isSelfEmployed: false,
      },
    };
    employmentStatus(req);
    assert(deleteIfPresent.callCount === 10);
    expect(deleteIfPresent.getCall(0).args[0]).to.equal(req);
    expect(deleteIfPresent.getCall(0).args[1]).to.equal(page1);
  });
  it('should not empty employment data if selfEmployed exist and not removed from employment-status', () => {
    req = {
      journeyData: {
        getDataForPage: () => ({
          workTypes: 'selfEmployed',
        }),
      },
      session: {
        isSelfEmployed: true,
      },
    };
    employmentStatus(req);
    assert(deleteIfPresent.notCalled);
  });
  it('should not empty employment data if selfEmployed not exist and not added from employment-status', () => {
    req = {
      journeyData: {
        getDataForPage: () => ({
          workTypes: 'employed',
        }),
      },
      session: {
        isSelfEmployed: false,
      },
    };
    employmentStatus(req);
    assert(deleteIfPresent.notCalled);
  });
});
