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
  it('should call deleteIfPresent thrice if sspRecent is \'no\' and url is /statutory-sick-pay-recent', () => {
    req.url = '/statutory-sick-pay-recent';
    statutorySickPay(req);
    assert(deleteIfPresent.calledThrice);
  });
  it('should call deleteIfPresent once if sspRecent is not no', () => {
    req.url = '/statutory-sick-pay-recent';
    req.journeyData.getDataForPage = (page) => {
      if (page === 'statutory-sick-pay-recent') {
        return {
          sspRecent: 'yes',
        };
      }
      return undefined;
    };
    statutorySickPay(req);
    assert(deleteIfPresent.calledOnce);
  });
  it('should call deleteIfPresent if url is \'/statutory-sick-pay-recent\'', () => {
    req.url = '/statutory-sick-pay-recent';
    statutorySickPay(req);
    assert(deleteIfPresent.called);
  });
});
