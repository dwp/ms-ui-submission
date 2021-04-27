const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const statutorySickPayEnd = require('../../../../app/lib/navigation-rules/statutory-sick-pay-end');

describe('statutory sick pay end navigation rules', () => {
  let req;
  let deleteIfPresent;
  const page = 'claim-start-date';
  const fieldNames = ['claimStartDate', 'hiddenSspEndDate'];

  beforeEach(() => {
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    req = {};
  });

  afterEach(() => {
    deleteIfPresent.restore();
  });
  it('should empty claimStartDate and claimStartDateAfterSsp if url is \'/statutory-sick-pay-end\'', () => {
    req.url = '/statutory-sick-pay-end';
    statutorySickPayEnd(req);
    assert(deleteIfPresent.calledTwice);
    assert(deleteIfPresent.calledWith(req, page, fieldNames));
  });
  it('should not empty claimStartDate and claimStartDateAfterSsp if url is not \'/statutory-sick-pay-end\'', () => {
    req.url = '/not-statutory-sick-pay-end';
    statutorySickPayEnd(req);
    assert(deleteIfPresent.notCalled);
  });
});
