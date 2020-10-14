const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { genericDataUtils, pensionDataUtils } = require('../../../../app/lib/data-utils');
const pensionDeductions = require('../../../../app/lib/navigation-rules/pension-deductions');

describe('pension deductions navigation rules', () => {
  let req;
  let deleteIfPresent;
  let updateSpecificPension;

  afterEach(() => {
    deleteIfPresent.restore();
    updateSpecificPension.restore();
  });
  beforeEach(() => {
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    updateSpecificPension = sinon.stub(pensionDataUtils, 'updateSpecificPension');
    req = {
      session: {
        editIndex: 0,
        pensionGather: [
          { deductions: 'no' },
        ],
      },
      journeyData: {},
    };
  });
  it('should do nothing if the pension-payment is undefined', () => {
    req.journeyData.getDataForPage = () => undefined;
    pensionDeductions(req);
    assert(deleteIfPresent.notCalled);
  });
  it('should call deleteIfPresent four times if pension-payment page has data and deductions has changed from no to yes', () => {
    req.session.pensionGather[0] = { deductions: 'no' };
    req.journeyData.getDataForPage = (page) => {
      if (page === 'pension-payment') {
        return 'data';
      }
      if (page === 'pension-deductions') {
        return {
          deductions: 'yes',
        };
      }
      return undefined;
    };
    pensionDeductions(req);
    assert(deleteIfPresent.callCount === 4);
  });
  it('should call updateSpecificPension once if pension-payment page has data and deductions has changed from no to notsure', () => {
    req.session.pensionGather[0] = { deductions: 'no' };
    req.journeyData.getDataForPage = (page) => {
      if (page === 'pension-payment') {
        return 'data';
      }
      if (page === 'pension-deductions') {
        return {
          deductions: 'notsure',
        };
      }
      return undefined;
    };
    pensionDeductions(req);
    assert(updateSpecificPension.calledOnce);
  });
  it('should call updateSpecificPension once if deductions has not been changed', () => {
    req.session.pensionGather[0] = { deductions: 'no' };
    req.journeyData.getDataForPage = (page) => {
      if (page === 'pension-payment') {
        return 'data';
      }
      if (page === 'pension-deductions') {
        return {
          deductions: 'no',
        };
      }
      return undefined;
    };
    pensionDeductions(req);
    assert(updateSpecificPension.calledOnce);
  });
});
