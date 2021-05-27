const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const lateClaim = require('../../../../app/lib/navigation-rules/late-claim');

describe('late claim navigation rules', () => {
  let req;
  let deleteIfPresent;

  afterEach(() => {
    deleteIfPresent.restore();
  });
  beforeEach(() => {
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    req = {
      journeyData: {
        getDataForPage: () => ({
          lateClaim: 'yes',
        }),
      },
    };
  });
  it('should call deleteIfPresent once if lateClaim is yes', () => {
    lateClaim(req);
    assert(deleteIfPresent.calledOnce);
  });
  it('should call deleteIfPresent twice if lateClaim is no', () => {
    req = {
      journeyData: {
        getDataForPage: () => ({
          lateClaim: 'no',
        }),
      },
    };
    lateClaim(req);
    assert(deleteIfPresent.calledTwice);
  });
  it('should call deleteIfPresent once if lateClaim is undefined', () => {
    req = {
      journeyData: {
        getDataForPage: () => ({
        }),
      },
    };
    lateClaim(req);
    assert(deleteIfPresent.calledOnce);
  });
});
