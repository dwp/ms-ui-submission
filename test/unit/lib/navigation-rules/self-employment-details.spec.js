const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { employmentDataUtils } = require('../../../../app/lib/data-utils');
const selfEmploymentDetails = require('../../../../app/lib/navigation-rules/self-employment-details');

describe('self employment details navigation rules', () => {
  let req;
  let updateSpecificEmployment;

  beforeEach(() => {
    updateSpecificEmployment = sinon.stub(employmentDataUtils, 'updateSpecificEmployment');
    req = {
      session: {},
    };
  });

  afterEach(() => {
    updateSpecificEmployment.restore();
  });
  it('should update the employment entry if in employment edit section', () => {
    req.session.editSection = 'employment';
    req.url = '/self-employment-details?edit';
    selfEmploymentDetails(req);
    assert(updateSpecificEmployment.calledOnce);
  });
  it('should not update the employment entry if not in employment edit section', () => {
    req.session.editSection = '';
    req.url = '';
    selfEmploymentDetails(req);
    assert(updateSpecificEmployment.notCalled);
  });
});
