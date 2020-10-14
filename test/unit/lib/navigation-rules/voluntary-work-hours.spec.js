const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { voluntaryDataUtils } = require('../../../../app/lib/data-utils');
const voluntaryWorkHours = require('../../../../app/lib/navigation-rules/voluntary-work-hours');

describe('voluntary work hours navigation rules', () => {
  let req;
  let updateSpecificVoluntary;
  let addVoluntaryToGather;

  beforeEach(() => {
    updateSpecificVoluntary = sinon.stub(voluntaryDataUtils, 'updateSpecificVoluntary');
    addVoluntaryToGather = sinon.stub(voluntaryDataUtils, 'addVoluntaryToGather');
    req = {
      session: {
        editSection: 'voluntary',
      },
    };
  });

  afterEach(() => {
    updateSpecificVoluntary.restore();
    addVoluntaryToGather.restore();
  });
  it('should update voluntary work hours if the editSection is voluntary', () => {
    voluntaryWorkHours(req);
    assert(updateSpecificVoluntary.called);
  });
  it('should call addVoluntaryHours if the editSection is not voluntary', () => {
    delete req.session.editSection;
    voluntaryWorkHours(req);
    assert(updateSpecificVoluntary.notCalled);
    assert(addVoluntaryToGather.called);
  });
});
