const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const { assert, expect } = chai;

const conditionDataUtils = rewire('../../../../app/lib/data-utils/conditionDataUtils.js');

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
      setDataForPage: (p, d) => {
        cd.data[p] = d;
      },
    };
    conditionDataUtils.populateConditionJourneyData(cd, {
      conditionName: 'test',
      conditionStartDate: '02-02-2021',
    });
    expect(cd.data).to.eql({
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
      journeyData: {
        setDataForPage: (p, d) => {
          req.journeyData.data[p] = d;
        },
        getDataForPage: (p) => req.journeyData.data[p],
        data: {
          conditions: {},
          'another-health-condition': {
            anotherCondition: 'yes',
          },
        },
      },
    };
    conditionDataUtils.clearConditionJourneyData(req);
    expect(req.journeyData.data).to.eql({
      conditions: undefined,
      'another-health-condition': undefined,
    });
  });
});

describe('conditionDataUtils.updateSpecificCondition', () => {
  it('should update a specific instance of condition to the condition Gather and call relevant functions', () => {
    const req = {
      journeyData: {
        getData: sinon.stub(),
        setDataForPage: sinon.stub(),
      },
      session: {
        editIndex: 0,
        conditionGather: [],
      },
    };
    const getConditionFromJourneyData = sinon.stub().returns('data');
    /* eslint-disable-next-line no-underscore-dangle */
    conditionDataUtils.__set__('getConditionFromJourneyData', getConditionFromJourneyData);
    const clearConditionJourneyData = sinon.stub().resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    conditionDataUtils.__set__('clearConditionJourneyData', clearConditionJourneyData);
    conditionDataUtils.updateSpecificCondition(req);
    assert(getConditionFromJourneyData.calledOnce);
    assert(clearConditionJourneyData.calledOnce);
    expect(req.session.conditionGather[0]).to.equal('data');
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
      journeyData: {
        getData: sinon.stub(),
      },
      session: {
        conditionGather: [{ condition: 'test' }],
      },
    };
    const getConditionFromJourneyData = sinon.stub().returns({ condition: 'test' });
    /* eslint-disable-next-line no-underscore-dangle */
    conditionDataUtils.__set__('getConditionFromJourneyData', getConditionFromJourneyData);
    conditionDataUtils.addConditionToGather(req);
    assert(getConditionFromJourneyData.calledOnce);
    expect(req.session.conditionGather.length).to.equal(2);
    conditionDataUtils.addConditionToGather(req, true);
    expect(req.session.conditionGather.length).to.equal(2);
    conditionDataUtils.addConditionToGather(req);
    expect(req.session.conditionGather.length).to.equal(3);
  });
});
