const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { insuranceDataUtils } = require('../../../../app/lib/data-utils');
const insurancePayment = require('../../../../app/lib/navigation-rules/insurance-payment');

describe('insurance payment navigation rules', () => {
  let req;
  let updateSpecificInsurance;
  let addInsuranceToGather;

  afterEach(() => {
    updateSpecificInsurance.restore();
    addInsuranceToGather.restore();
  });
  beforeEach(() => {
    updateSpecificInsurance = sinon.stub(insuranceDataUtils, 'updateSpecificInsurance');
    addInsuranceToGather = sinon.stub(insuranceDataUtils, 'addInsuranceToGather');
    req = {
      session: {
        editSection: 'insurance',
      },
    };
  });
  it('should call updateSpecificInsurance if editSection is insurance', () => {
    insurancePayment(req);
    assert(updateSpecificInsurance.called);
    assert(addInsuranceToGather.notCalled);
  });
  it('should call addInsuranceToGather if editSection is not insurance', () => {
    delete req.session.editSection;
    insurancePayment(req);
    assert(updateSpecificInsurance.notCalled);
    assert(addInsuranceToGather.called);
  });
});
