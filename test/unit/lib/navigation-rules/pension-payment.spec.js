const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { pensionDataUtils } = require('../../../../app/lib/data-utils');
const pensionPayment = require('../../../../app/lib/navigation-rules/pension-payment');

describe('pension payment navigation rules', () => {
  let req;
  let updateSpecificPension;

  afterEach(() => {
    updateSpecificPension.restore();
  });
  beforeEach(() => {
    updateSpecificPension = sinon.stub(pensionDataUtils, 'updateSpecificPension');
    req = {
      journeyData: {
        getDataForPage: (page) => {
          if (page === 'pension-deductions') {
            return {
              deductions: 'no',
            };
          }
          return undefined;
        },
      },
      session: {
        editSection: 'pension',
      },
    };
  });
  it('should call updateSpecificInsurance if editSection is pension and deductions are \'no\'', () => {
    pensionPayment(req);
    assert(updateSpecificPension.called);
  });
  it('should not call updateSpecificInsurance if editSection is not pension', () => {
    delete req.session.editSection;
    pensionPayment(req);
    assert(updateSpecificPension.notCalled);
  });
  it('should not call updateSpecificInsurance if editSection is pension and deductions is not no', () => {
    req.journeyData.getDataForPage = (page) => {
      if (page === 'pension-deductions') {
        return {
          deductions: 'yes',
        };
      }
      return undefined;
    };
    pensionPayment(req);
    assert(updateSpecificPension.notCalled);
  });
});
