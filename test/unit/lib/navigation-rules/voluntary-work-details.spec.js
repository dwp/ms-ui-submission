const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { voluntaryDataUtils } = require('../../../../app/lib/data-utils');
const voluntaryWorkDetails = require('../../../../app/lib/navigation-rules/voluntary-work-details');

describe('voluntary work details navigation rules', () => {
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
  it('should update voluntary work details if the editSection is voluntary', () => {
    voluntaryWorkDetails(req);
    assert(updateSpecificVoluntary.called);
  });
  it('should not update the voluntary work details if the editSection is not voluntary', () => {
    delete req.session.editSection;
    voluntaryWorkDetails(req);
    assert(updateSpecificVoluntary.notCalled);
  });
});
