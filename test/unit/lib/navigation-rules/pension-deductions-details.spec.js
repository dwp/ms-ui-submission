const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { pensionDataUtils } = require('../../../../app/lib/data-utils');
const pensionDeductionsDetails = require('../../../../app/lib/navigation-rules/pension-deductions-details');

describe('pension deductions navigation rules', () => {
  let req;
  let updateSpecificPension;

  afterEach(() => {
    updateSpecificPension.restore();
  });
  beforeEach(() => {
    updateSpecificPension = sinon.stub(pensionDataUtils, 'updateSpecificPension');
    req = {
      session: {
        editSection: 'pension',
      },
    };
  });
  it('should call updateSpecificPension if editSection is pension', () => {
    pensionDeductionsDetails(req);
    assert(updateSpecificPension.called);
  });
  it('should not call updateSpecificPension if editSection is not pension', () => {
    delete req.session.editSection;
    pensionDeductionsDetails(req);
    assert(updateSpecificPension.notCalled);
  });
});
