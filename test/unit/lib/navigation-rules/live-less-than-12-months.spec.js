const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;

const { genericDataUtils } = require('../../../../app/lib/data-utils');

const severeCondition = require('../../../../app/lib/navigation-rules/live-less-than-12-months');

describe('severe condition navigation rules', () => {
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
          if (page === 'live-less-than-12-months') {
            return {
              severeCondition: 'no',
            };
          }
          return undefined;
        },
      },
    };
  });
  it('should call deleteIfPresent if severeCondition is \'no\'', () => {
    severeCondition(req);
    assert(deleteIfPresent.called);
  });
  it('should not call deleteIfPresent if severeCondition is not no', () => {
    req.journeyData.getDataForPage = (page) => {
      if (page === 'live-less-than-12-months') {
        return {
          severeCondition: 'yes',
        };
      }
      return undefined;
    };
    severeCondition(req);
    assert(deleteIfPresent.notCalled);
  });
});
