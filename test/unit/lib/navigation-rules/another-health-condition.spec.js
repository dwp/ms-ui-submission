const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { conditionDataUtils } = require('../../../../app/lib/data-utils');
const anotherHealthCondition = require('../../../../app/lib/navigation-rules/another-health-condition');

describe('another-health-condition navigation rules', () => {
  let req;
  let updateSpecificCondition;
  let clearConditionJourneyData;

  beforeEach(() => {
    updateSpecificCondition = sinon.stub(conditionDataUtils, 'updateSpecificCondition');
    clearConditionJourneyData = sinon.stub(conditionDataUtils, 'clearConditionJourneyData');
    req = {
      session: {
        conditionGather: {
          length: 1,
        },
      },
    };
  });
  afterEach(() => {
    updateSpecificCondition.restore();
    clearConditionJourneyData.restore();
  });

  it('should setData if conditionGather is more than 11', () => {
    req = {
      session: {
        conditionGather: {
          length: 12,
        },
      },
      journeyData: {
        getDataForPage: () => ({
          anotherCondition: 'no',
        }),
        setDataForPage: sinon.stub()
          .returns('something'),
      },
    };
    anotherHealthCondition(req);
    assert(req.journeyData.setDataForPage.called);
  });
  it('should update the condition entry if in condition edit section', () => {
    req.session.editSection = 'condition';
    req.url = '/another-health-condition?edit';
    anotherHealthCondition(req);
    assert(updateSpecificCondition.calledOnce);
  });

  it('should clear the condition if anotherCondition is no', () => {
    req = {
      journeyData: {
        getDataForPage: () => ({
          anotherCondition: 'no',
        }),
      },
      session: {
        conditionGather: {
          length: 1,
        },
      },
    };
    anotherHealthCondition(req);
    assert(clearConditionJourneyData.calledOnce);
  });
  it('should clear the condition if anotherCondition is yes', () => {
    req = {
      journeyData: {
        getDataForPage: () => ({
          anotherCondition: 'yes',
        }),
      },
      session: {
        conditionGather: {
          length: 1,
        },
      },
    };
    anotherHealthCondition(req);
    assert(clearConditionJourneyData.calledOnce);
  });
});
