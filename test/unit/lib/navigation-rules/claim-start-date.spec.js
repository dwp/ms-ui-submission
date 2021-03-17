const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const claimStartDate = require('../../../../app/lib/navigation-rules/claim-start-date');

describe('claim start date navigation rules', () => {
  let req;
  let deleteIfPresent;

  afterEach(() => {
    deleteIfPresent.restore();
  });
  beforeEach(() => {
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    req = {
      url: '/claim-start-date',
      journeyData: {
        getDataForPage: () => ({
          claimEnd: 'yes',
        }),
      },
    };
  });
  it('should call deleteIfPresent once if url contains \'/claim-start-date\'', () => {
    claimStartDate(req);
    assert(deleteIfPresent.calledOnce);
  });
  it('should not call deleteIfPresent if url not contains \'/claim-start-date\'', () => {
    req = {
      url: '/claim-end-date',
      journeyData: {
        getDataForPage: () => ({
          claimEnd: 'yes',
        }),
      },
    };
    claimStartDate(req);
    assert(deleteIfPresent.notCalled);
  });

  it('should not call deleteIfPresent once if url contains \'claimEnd\' is no', () => {
    req = {
      url: '/claim-end-date',
      journeyData: {
        getDataForPage: () => ({
          claimEnd: 'no',
        }),
      },
    };
    claimStartDate(req);
    assert(deleteIfPresent.notCalled);
  });
});
