const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { employmentDataUtils } = require('../../../../app/lib/data-utils');
const employmentDetails = require('../../../../app/lib/navigation-rules/employment-details');

describe('employment details navigation rules', () => {
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
    employmentDetails(req);
    assert(updateSpecificEmployment.calledOnce);
  });
  it('should not update the employment entry if not in employment edit section', () => {
    req.session.editSection = '';
    employmentDetails(req);
    assert(updateSpecificEmployment.notCalled);
  });
});
