const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { pensionDataUtils } = require('../../../../app/lib/data-utils');
const pensionFrequency = require('../../../../app/lib/navigation-rules/pension-frequency');

describe('pension frequency navigation rules', () => {
  let req;
  let updateSpecificPension;

  afterEach(() => {
    updateSpecificPension.restore();
  });
  beforeEach(() => {
    updateSpecificPension = sinon.stub(pensionDataUtils, 'updateSpecificPension');
    req = {
      journeyData: {
        getDataForPage: (page) => {
          if (page === 'pension-frequency') {
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
  it('should set frequency to \'none\' if the pension-frequency page is an empty object', () => {
    pensionFrequency(req);
    assert(req.journeyData.setDataForPage.called);
  });
  it('should not set frequency to \'none\' if the pension-frequency page is an not empty object', () => {
    req.journeyData.getDataForPage = (page) => {
      if (page === 'pension-frequency') {
        return {
          avalue: 'is a value',
        };
      }
      return undefined;
    };
    pensionFrequency(req);
    assert(req.journeyData.setDataForPage.notCalled);
  });
  it('should call updateSpecificPension if the edit section is pension', () => {
    pensionFrequency(req);
    assert(updateSpecificPension.called);
  });
  it('should not call updateSpecificPension if the edit section is not pension', () => {
    delete req.session.editSection;
    pensionFrequency(req);
    assert(updateSpecificPension.notCalled);
  });
});
