const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { insuranceDataUtils } = require('../../../../app/lib/data-utils');
const insurancePremiums = require('../../../../app/lib/navigation-rules/insurance-premiums');

describe('insurance premiums navigation rules', () => {
  let req;
  let updateSpecificInsurance;

  afterEach(() => {
    updateSpecificInsurance.restore();
  });
  beforeEach(() => {
    updateSpecificInsurance = sinon.stub(insuranceDataUtils, 'updateSpecificInsurance');
    req = {
      journeyData: {
        getDataForPage: (page) => {
          if (page === 'insurance-premiums') {
            return {
              premiums: 'no',
            };
          }
          return undefined;
        },
      },
      session: {
        editSection: 'insurance',
      },
    };
  });
  it('should not call anything if editSection is insurance and premiums is not yes', () => {
    insurancePremiums(req);
    assert(updateSpecificInsurance.notCalled);
  });
  it('should call updateSpecificInsurance if editSection is insurance and premiums is yes', () => {
    req.journeyData.getDataForPage = (page) => {
      if (page === 'insurance-premiums') {
        return {
          premiums: 'yes',
        };
      }
      return undefined;
    };
    insurancePremiums(req);
    assert(updateSpecificInsurance.called);
  });
  it('should not callanything if editPage is not insurance', () => {
    delete req.session.editSection;
    insurancePremiums(req);
    assert(updateSpecificInsurance.notCalled);
  });
});
