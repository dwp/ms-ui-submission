const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const otherNumber = require('../../../../app/lib/navigation-rules/other-number');

describe('other number navigation rules', () => {
  let req;
  let res;
  let next;
  let deleteIfPresent;

  beforeEach(() => {
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    req = {
      session: {
        editing: true,
        save: sinon.stub().yields(),
        journeyData: {
          'other-number': {},
        },
      },
    };
    res = {
      status: sinon.stub().returns({
        redirect: sinon.stub(),
      }),
    };
    next = sinon.stub();
  });
  afterEach(() => {
    deleteIfPresent.restore();
  });
  it('should empty other number if other is changed to no', () => {
    req.journeyData = {
      getDataForPage: () => ({
        other: 'no',
        number: '123123123123',
      }),
    };
    otherNumber(req, res, next);
    assert(deleteIfPresent.calledOnce);
  });
  it('should not empty other number if other is changed to yes', () => {
    req.journeyData = {
      getDataForPage: () => ({
        other: 'yes',
        number: '343434343434',
      }),
    };
    otherNumber(req, res, next);
    assert(deleteIfPresent.notCalled);
  });
});
