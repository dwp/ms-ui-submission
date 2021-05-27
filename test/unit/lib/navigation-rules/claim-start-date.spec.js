const moment = require('moment');
const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const claimStartDate = require('../../../../app/lib/navigation-rules/claim-start-date');

describe('claim start date navigation rules', () => {
  let req;
  let deleteIfPresent;
  const claimDate = moment().subtract(1, 'month').startOf('day');
  const claimStartDt = {
    dd: claimDate.date(),
    mm: claimDate.month() + 1,
    yyyy: claimDate.year(),
  };

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
          claimStartDate: claimStartDt,
        }),
        setDataForPage: sinon.stub(),
      },
    };
  });
  it('should call deleteIfPresent twice if url contains \'/claim-start-date\'', () => {
    claimStartDate(req);
    assert(deleteIfPresent.calledTwice);
  });
  it('should call deleteIfPresent once if url not contains \'/claim-end-date\' and \'claimEnd\' is yes', () => {
    req = {
      url: '/claim-end-date',
      journeyData: {
        getDataForPage: () => ({
          claimEnd: 'yes',
          claimStartDate: claimStartDt,
        }),
        setDataForPage: sinon.stub(),
      },
    };
    claimStartDate(req);
    assert(deleteIfPresent.calledOnce);
  });

  it('should call deleteIfPresent once if url contains \'/claim-end-date\' and \'claimEnd\' is no', () => {
    const claimDate1 = moment().subtract(4, 'month').startOf('day');
    const claimStartDt1 = {
      dd: claimDate1.date(),
      mm: claimDate1.month() + 1,
      yyyy: claimDate1.year(),
    };
    req = {
      url: '/claim-end-date',
      journeyData: {
        getDataForPage: () => ({
          claimEnd: 'no',
          claimStartDate: claimStartDt1,
        }),
        setDataForPage: sinon.stub(),
      },
    };
    claimStartDate(req);
    assert(deleteIfPresent.calledOnce);
  });
});
