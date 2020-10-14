const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const statutoryPay = require('../../../../app/lib/navigation-rules/statutory-pay');

describe('statutory pay navigation rules', () => {
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
          if (page === 'statutory-pay') {
            return {
              statutoryPay: 'yes',
            };
          }
          return undefined;
        },
      },
    };
  });
  it('should call deleteIfPresent if statutoryPay is \'yes\'', () => {
    statutoryPay(req);
    assert(deleteIfPresent.calledTwice);
  });
  it('should call deleteIfPresent once if statutoryPay is no', () => {
    req.journeyData.getDataForPage = (page) => {
      if (page === 'statutory-pay') {
        return {
          statutoryPay: 'no',
        };
      }
      return undefined;
    };
    statutoryPay(req);
    assert(deleteIfPresent.calledOnce);
  });
  it('should not call deleteIfPresent if statutoryPay is not no', () => {
    req.journeyData.getDataForPage = (page) => {
      if (page === 'statutory-pay') {
        return {
          statutoryPay: 'notno',
        };
      }
      return undefined;
    };
    statutoryPay(req);
    assert(deleteIfPresent.notCalled);
  });
});
