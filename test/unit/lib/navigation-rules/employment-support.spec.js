const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { employmentDataUtils } = require('../../../../app/lib/data-utils');
const employmentSupport = require('../../../../app/lib/navigation-rules/employment-support');

describe('employment status navigation rules', () => {
  let req;
  let updateSpecificEmployment;

  afterEach(() => {
    updateSpecificEmployment.restore();
  });
  beforeEach(() => {
    updateSpecificEmployment = sinon.stub(employmentDataUtils, 'updateSpecificEmployment');
    req = {
      session: {
        editPage: 'employment-support',
      },
    };
  });
  it('should call updateSpecificEmployment if editPage is employment-support', () => {
    employmentSupport(req);
    assert(updateSpecificEmployment.called);
  });
  it('should not call updateSpecificEmployment if editPage is not employment-support', () => {
    req.session.editPage = 'some other page';
    employmentSupport(req);
    assert(updateSpecificEmployment.notCalled);
  });
});
