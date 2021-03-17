const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const claimStartDateAfterSsp = require('../../../../app/lib/navigation-rules/claim-start-date-after-statutory-sick-pay');

describe('claim start date after ssp navigation rules', () => {
  let req;
  let deleteIfPresent;

  afterEach(() => {
    deleteIfPresent.restore();
  });
  beforeEach(() => {
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    req = {
      journeyData: {
        getDataForPage: (page) => {
          if (page === 'claim-start-date-after-statutory-sick-pay') {
            return {
              claimStartDateAfterSsp: 'no',
            };
          }
          return undefined;
        },
      },
    };
  });

  afterEach(() => {
    deleteIfPresent.restore();
  });
  it('should call deleteIfPresent twice if url is /claim-start-date-after-statutory-sick-pay', () => {
    req.url = '/claim-start-date-after-statutory-sick-pay';
    claimStartDateAfterSsp(req);
    assert(deleteIfPresent.calledTwice);
  });
  it('should not call deleteIfPresent if url is not \'/claim-start-date-after-statutory-sick-pay\'', () => {
    req.url = '/not-claim-start-date-after-statutory-sick-pay';
    claimStartDateAfterSsp(req);
    assert(deleteIfPresent.notCalled);
  });
});
