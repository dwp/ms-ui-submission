const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { employmentDataUtils, genericDataUtils } = require('../../../../app/lib/data-utils');
const employmentOffSick = require('../../../../app/lib/navigation-rules/employment-off-sick');

describe('employment off sick navigation rules', () => {
  let req;
  let updateSpecificEmployment;
  let deleteIfPresent;

  afterEach(() => {
    updateSpecificEmployment.restore();
    deleteIfPresent.restore();
  });
  beforeEach(() => {
    updateSpecificEmployment = sinon.stub(employmentDataUtils, 'updateSpecificEmployment');
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    req = {
      journeyData: {
        getData: () => ({
          'employment-off-sick': {
            offSick: 'yes',
          },
        }),
        getDataForPage: () => {},
      },
      session: {
        employmentGather: [
          {
            offSick: 'yes',
          },
        ],
        editIndex: 0,
        editPage: 'employment-off-sick',
      },
    };
  });
  it('should call updateSpecificEmployment if offSick hasn\'t changed ', () => {
    employmentOffSick(req);
    assert(updateSpecificEmployment.called);
  });
  it('should not do anything if editPage is not set', () => {
    delete req.session.editPage;
    employmentOffSick(req);
    assert(updateSpecificEmployment.notCalled);
    assert(deleteIfPresent.notCalled);
  });
});
