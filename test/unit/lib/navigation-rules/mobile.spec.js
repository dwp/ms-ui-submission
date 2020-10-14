const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const mobile = require('../../../../app/lib/navigation-rules/mobile');

describe('mobile number navigation rules', () => {
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
          mobile: {},
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

  it('should empty mobile number if mobile is changed to no', () => {
    req.journeyData = {
      getDataForPage: () => ({
        mobile: 'no',
        number: '123123123123',
      }),
    };
    req.session.journeyData.mobile.number = '123123123123';
    mobile(req, res, next);
    assert(deleteIfPresent.calledOnce);
  });
  it('should not empty mobile number, and should empty all fields for other-number, if mobile is changed to yes', () => {
    req.journeyData = {
      getDataForPage: () => ({
        mobile: 'yes',
        number: '343434343434',
      }),
    };
    req.session.journeyData.mobile.number = '343434343434';
    req.session.journeyData['other-number'] = {
      other: 'yes',
      number: '989898989898',
    };
    mobile(req, res, next);
    assert(deleteIfPresent.calledOnce);
  });
});
