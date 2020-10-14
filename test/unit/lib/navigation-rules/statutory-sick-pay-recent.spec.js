const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const statutorySickPay = require('../../../../app/lib/navigation-rules/statutory-sick-pay-recent');

describe('statutory sick pay recent navigation rules', () => {
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
          if (page === 'statutory-sick-pay-recent') {
            return {
              sspRecent: 'no',
            };
          }
          return undefined;
        },
      },
    };
  });
  it('should call deleteIfPresent if sspRecent is \'no\'', () => {
    statutorySickPay(req);
    assert(deleteIfPresent.called);
  });
  it('should not call deleteIfPresent if sspRecent is not no', () => {
    req.journeyData.getDataForPage = (page) => {
      if (page === 'statutory-sick-pay-recent') {
        return {
          sspRecent: 'yes',
        };
      }
      return undefined;
    };
    statutorySickPay(req);
    assert(deleteIfPresent.notCalled);
  });
});
