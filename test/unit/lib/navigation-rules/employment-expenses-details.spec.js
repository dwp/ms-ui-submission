const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { employmentDataUtils } = require('../../../../app/lib/data-utils');
const employmentExpensesDetails = require('../../../../app/lib/navigation-rules/employment-expenses-details');

describe('employment details navigation rules', () => {
  let req;
  let updateSpecificEmployment;
  let addEmploymentToGather;

  beforeEach(() => {
    updateSpecificEmployment = sinon.stub(employmentDataUtils, 'updateSpecificEmployment');
    addEmploymentToGather = sinon.stub(employmentDataUtils, 'addEmploymentToGather');
    req = {
      session: {},
    };
  });

  afterEach(() => {
    updateSpecificEmployment.restore();
    addEmploymentToGather.restore();
  });
  it('should update the employment entry if in employment edit section', () => {
    req.session.editSection = 'employment';
    employmentExpensesDetails(req);
    assert(updateSpecificEmployment.calledOnce);
    assert(addEmploymentToGather.notCalled);
  });
  it('should add the employment entry to the gather if not in employment edit section', () => {
    req.session.editSection = '';
    employmentExpensesDetails(req);
    assert(updateSpecificEmployment.notCalled);
    assert(addEmploymentToGather.calledOnce);
  });
});
