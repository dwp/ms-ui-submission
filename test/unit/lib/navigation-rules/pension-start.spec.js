const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { pensionDataUtils } = require('../../../../app/lib/data-utils');
const pensionStart = require('../../../../app/lib/navigation-rules/pension-start');

describe('pension start navigation rules', () => {
  let req;
  let updateSpecificPension;

  beforeEach(() => {
    updateSpecificPension = sinon.stub(pensionDataUtils, 'updateSpecificPension');
    req = {
      session: {
        editSection: 'pension',
      },
    };
  });

  afterEach(() => {
    updateSpecificPension.restore();
  });
  it('should update the pension start if the editSection is pension', () => {
    pensionStart(req);
    assert(updateSpecificPension.calledOnce);
  });
  it('should not update the pension start if the editSection is not pension', () => {
    req.session.editSection = '';
    pensionStart(req);
    assert(updateSpecificPension.notCalled);
  });
});
