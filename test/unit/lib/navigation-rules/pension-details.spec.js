const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { pensionDataUtils } = require('../../../../app/lib/data-utils');
const pensionDetails = require('../../../../app/lib/navigation-rules/pension-details');

describe('pension details navigation rules', () => {
  let req;
  let updateSpecificPension;

  beforeEach(() => {
    updateSpecificPension = sinon.stub(pensionDataUtils, 'updateSpecificPension');
    req = {
      session: {},
    };
  });

  afterEach(() => {
    updateSpecificPension.restore();
  });
  it('should update the pension entry if in pension edit section', () => {
    req.session.editSection = 'pension';
    pensionDetails(req);
    assert(updateSpecificPension.calledOnce);
  });
  it('should not update the pension entry if not in pension edit section', () => {
    delete req.session.editSection;
    pensionDetails(req);
    assert(updateSpecificPension.notCalled);
  });
});
