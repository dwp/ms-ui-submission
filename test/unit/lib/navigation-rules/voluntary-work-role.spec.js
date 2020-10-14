const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { voluntaryDataUtils } = require('../../../../app/lib/data-utils');
const voluntaryWorkRole = require('../../../../app/lib/navigation-rules/voluntary-work-role');

describe('voluntary work role navigation rules', () => {
  let req;
  let updateSpecificVoluntary;

  beforeEach(() => {
    updateSpecificVoluntary = sinon.stub(voluntaryDataUtils, 'updateSpecificVoluntary');
    req = {
      session: {
        editSection: 'voluntary',
      },
    };
  });

  afterEach(() => {
    updateSpecificVoluntary.restore();
  });
  it('should update voluntary work role if the editSection is voluntary', () => {
    voluntaryWorkRole(req);
    assert(updateSpecificVoluntary.called);
  });
  it('should not update the voluntary work role if the editSection is not voluntary', () => {
    delete req.session.editSection;
    voluntaryWorkRole(req);
    assert(updateSpecificVoluntary.notCalled);
  });
});
