const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { conditionDataUtils } = require('../../../../app/lib/data-utils');
const conditions = require('../../../../app/lib/navigation-rules/conditions');

describe('conditions navigation rules', () => {
  let req;
  let updateSpecificCondition;
  let addConditionToGather;

  beforeEach(() => {
    updateSpecificCondition = sinon.stub(conditionDataUtils, 'updateSpecificCondition');
    addConditionToGather = sinon.stub(conditionDataUtils, 'addConditionToGather');
  });
  afterEach(() => {
    updateSpecificCondition.restore();
    addConditionToGather.restore();
  });

  it('should update the condition entry and setData if in condition edit section', () => {
    req = {
      session: {
        editSection: 'condition',
      },
      journeyData: {
        setDataForPage: sinon.stub()
          .returns('something'),
      },
    };
    conditions(req);
    assert(updateSpecificCondition.calledOnce);
    assert(req.journeyData.setDataForPage.called);
  });

  it('should add the condition if not in condition edit section', () => {
    req = {
      session: {
        editSection: 'something',
        conditionBack: true,
      },
    };
    conditions(req);
    assert(addConditionToGather.calledOnce);
  });
});
