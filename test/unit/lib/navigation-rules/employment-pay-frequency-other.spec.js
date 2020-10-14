const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { employmentDataUtils } = require('../../../../app/lib/data-utils');
const employmentPayFrequencyOther = require('../../../../app/lib/navigation-rules/employment-pay-frequency-other');

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
    employmentPayFrequencyOther(req);
    assert(updateSpecificEmployment.called);
  });
  it('should call updateSpecificEmployment if the edit page is employment-pay-frequency-other', () => {
    req.session.editPage = 'employment-pay-frequency-other';
    employmentPayFrequencyOther(req);
    assert(updateSpecificEmployment.called);
  });
  it('should not call updateSpecificEmployment if edit page is something else', () => {
    req.session.editPage = 'employment-off-sick';
    employmentPayFrequencyOther(req);
    assert(updateSpecificEmployment.notCalled);
  });
});
