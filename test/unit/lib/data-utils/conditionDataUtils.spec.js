import sinon from 'sinon';
import { assert, expect } from 'chai';
import conditionDataUtils from '../../../../src/lib/data-utils/conditionDataUtils.js';

describe('conditionDataUtils.getConditionFromJourneyData', () => {
  it('should build a valid condition object', () => {
    const cd = {
      conditions: {
        conditionName: 'test',
        conditionStartDate: '02-02-2021',
      },
    };
    expect(conditionDataUtils.getConditionFromJourneyData(cd))
      .to
      .eql({
        conditionName: 'test',
        conditionStartDate: '02-02-2021',
      });
  });
});

describe('conditionDataUtils.populateConditionJourneyData', () => {
  it('should build a valid condition object', () => {
    const cd = {
      data: {},
      casa: {
        journeyContext: {
          setDataForPage: (p, d) => {
            cd.casa.journeyContext.data[p] = d;
          },
          data: {}
        },
      }
    };
    const res = {
      status: () => ({
        render: () => {},
      }),
    };
    const next = sinon.stub();
    conditionDataUtils.populateConditionJourneyData(cd, {
      conditionName: 'test',
      conditionStartDate: '02-02-2021',
    }, res, next, 'conditions');
    expect(cd.casa.journeyContext.data).to.eql({
      conditions: {
        conditionName: 'test',
        conditionStartDate: '02-02-2021',
      },
      'another-health-condition': {
        anotherCondition: 'yes',
      },
    });
  });
});

describe('conditionDataUtils.clearConditionJourneyData', () => {
  it('should remove condition journey data', () => {
    const req = {
      journeyContext: {
        setDataForPage: (p, d) => {
          req.journeyContext.data[p] = d;
        },
        getData: (p) => req.casa.journeyContext.data[p],
        data: {
          conditions: {},
          'another-health-condition': {
            anotherCondition: 'yes',
          },
        },
      },
    };
    conditionDataUtils.clearConditionJourneyData(req);
    expect(req.journeyContext.data).to.eql({
      conditions: {},
      'another-health-condition': {'anotherCondition' : 'yes'},
    });
  });
});

describe('conditionDataUtils.updateSpecificCondition', () => {
  it('should update a specific instance of condition to the condition Gather and call relevant functions', () => {
    const req = {
      journeyContext: {
        conditions: {
          conditionName: 'data',
          conditionStartDate: 'data',
        },
      },
      session: {
        editIndex: 0,
        conditionGather: [{
          conditionName: 'notdata',
          conditionStartDate: 'notdata',
        }],
        save: sinon.stub(),
      },
    };
    conditionDataUtils.updateSpecificCondition(req.journeyContext, req);
    expect(req.session.conditionGather[0].conditionName).to.equal('data');
    expect(req.session.conditionGather[0].conditionStartDate).to.equal('data');
  });
});

describe('conditionDataUtils.getConditionsCount', () => {
  it('should return 1 if session has one condition', () => {
    const req = {
      session: {
        conditionGather: [{ condition: 'test' }],
      },
    };
    expect(conditionDataUtils.getConditionsCount(req)).to.equal(1);
  });
});

describe('conditionDataUtils.addConditionToGather', () => {
  it('should add an instance of condition to the condition Gather and call relevant functions', () => {
    const req = {
      journeyContext: {
        conditions: {
          conditionName: 'data',
          conditionStartDate: 'data',
        },
      },
      session: {
        conditionGather: [{ condition: 'test' }],
        save: sinon.stub(),
      },
    };
    conditionDataUtils.addConditionToGather(req.journeyContext, req);
    expect(req.session.conditionGather.length).to.equal(2);
    conditionDataUtils.addConditionToGather(req.journeyContext, req, true);
    expect(req.session.conditionGather.length).to.equal(2);
    conditionDataUtils.addConditionToGather(req.journeyContext, req);
    expect(req.session.conditionGather.length).to.equal(3);
  });
});
