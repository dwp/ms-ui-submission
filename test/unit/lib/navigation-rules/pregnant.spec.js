const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const pregnant = require('../../../../app/lib/navigation-rules/pregnant');

describe('pregnant navigation rules', () => {
  let req;
  let deleteIfPresent;

  afterEach(() => {
    deleteIfPresent.restore();
  });
  beforeEach(() => {
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    req = {
      journeyData: {
        getDataForPage: (page) => {
          if (page === 'pregnant') {
            return {
              pregnant: 'no',
            };
          }
          return undefined;
        },
      },
    };
  });
  it('should call deleteIfPresent if pregnant is \'no\'', () => {
    pregnant(req);
    assert(deleteIfPresent.called);
  });
  it('should not call deleteIfPresent if pregnant is not no', () => {
    req.journeyData.getDataForPage = (page) => {
      if (page === 'pregnant') {
        return {
          pregnant: 'yes',
        };
      }
      return undefined;
    };
    pregnant(req);
    assert(deleteIfPresent.notCalled);
  });
});
