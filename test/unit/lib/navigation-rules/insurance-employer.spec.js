const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { insuranceDataUtils } = require('../../../../app/lib/data-utils');
const insuranceEmployer = require('../../../../app/lib/navigation-rules/insurance-employer');

describe('insurance employer navigation rules', () => {
  let req;
  let updateSpecificInsurance;

  afterEach(() => {
    updateSpecificInsurance.restore();
  });
  beforeEach(() => {
    updateSpecificInsurance = sinon.stub(insuranceDataUtils, 'updateSpecificInsurance');
    req = {
      session: {
        editSection: 'insurance',
      },
    };
  });
  it('should call updateSpecificInsurance if editSection is insurance', () => {
    insuranceEmployer(req);
    assert(updateSpecificInsurance.called);
  });
  it('should not call updateSpecificInsurance if editSection is not insurance', () => {
    delete req.session.editSection;
    insuranceEmployer(req);
    assert(updateSpecificInsurance.notCalled);
  });
});
