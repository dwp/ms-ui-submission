const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { pensionDataUtils } = require('../../../../app/lib/data-utils');
const pensionInherited = require('../../../../app/lib/navigation-rules/pension-inherited');

describe('pension inherited navigation rules', () => {
  let req;
  let updateSpecificPension;
  let addPensionToGather;

  afterEach(() => {
    updateSpecificPension.restore();
    addPensionToGather.restore();
  });
  beforeEach(() => {
    updateSpecificPension = sinon.stub(pensionDataUtils, 'updateSpecificPension');
    addPensionToGather = sinon.stub(pensionDataUtils, 'addPensionToGather');
    req = {
      journeyData: {
        getDataForPage: (page) => {
          if (page === 'pension-inherited') {
            return {};
          }
          return undefined;
        },
        setDataForPage: sinon.stub(),
      },
      session: {
        editSection: 'pension',
      },
    };
  });
  it('should set inherited to \'\' if the pension-inherited page is an empty object', () => {
    pensionInherited(req);
    assert(req.journeyData.setDataForPage.called);
  });
  it('should not set inherited to \'none\' if the pension-inherited page is an not empty object', () => {
    req.journeyData.getDataForPage = (page) => {
      if (page === 'pension-inherited') {
        return {
          avalue: 'is a value',
        };
      }
      return undefined;
    };
    pensionInherited(req);
    assert(req.journeyData.setDataForPage.notCalled);
  });
  it('should call updateSpecificPension if the edit section is pension', () => {
    pensionInherited(req);
    assert(updateSpecificPension.called);
  });
  it('should call addPensionToGather if the edit section is not pension', () => {
    delete req.session.editSection;
    pensionInherited(req);
    assert(updateSpecificPension.notCalled);
    assert(addPensionToGather.called);
  });
});
