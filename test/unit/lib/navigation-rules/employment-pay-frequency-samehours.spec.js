const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { employmentDataUtils } = require('../../../../app/lib/data-utils');
const employmentPayFrequencySameHours = require('../../../../app/lib/navigation-rules/employment-pay-frequency-samehours');

describe('employment pay frequency navigation rules', () => {
  let req;
  let updateSpecificEmployment;
  afterEach(() => {
    updateSpecificEmployment.restore();
  });
  beforeEach(() => {
    updateSpecificEmployment = sinon.stub(employmentDataUtils, 'updateSpecificEmployment');
    req = {
      session: {
        editPage: 'employment-hours',
      },
    };
  });
  it('should call updateSpecificEmployment the edit page is employment-hours', () => {
    employmentPayFrequencySameHours(req);
    assert(updateSpecificEmployment.called);
  });
  it('should call updateSpecificEmployment if the edit page is employment-pay-frequency-samehours', () => {
    req.session.editPage = 'employment-pay-frequency-samehours';
    employmentPayFrequencySameHours(req);
    assert(updateSpecificEmployment.called);
  });
  it('should not call updateSpecificEmployment if edit page is something else', () => {
    req.session.editPage = 'employment-off-sick';
    employmentPayFrequencySameHours(req);
    assert(updateSpecificEmployment.notCalled);
  });
});
