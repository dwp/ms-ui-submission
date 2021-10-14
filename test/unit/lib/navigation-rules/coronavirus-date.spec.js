const chai = require('chai');
const sinon = require('sinon');

const { assert, expect } = chai;
const coronavirusDate = require('../../../../app/lib/navigation-rules/coronavirus-date');

describe('coronavirus-date navigation rules', () => {
  let req;

  it('should set coronavirusOtherCondition as yes if editing is true and have conditions', () => {
    req = {
      editOriginUrl: '/coronavirus-date',
      session: {
        editing: true,
        conditionGather: ['cond1'],
      },
      journeyData: {
        setDataForPage: sinon.stub()
          .returns('something'),
      },
    };
    coronavirusDate(req);
    assert(req.journeyData.setDataForPage.called);
    expect(req.journeyData.setDataForPage.firstCall.firstArg).to.equal('coronavirus-other-condition');
    expect(req.journeyData.setDataForPage.firstCall.lastArg.coronavirusOtherCondition).to.equal('yes');
  });

  it('should set coronavirusOtherCondition as no if editing is true and have no conditions', () => {
    req = {
      editOriginUrl: '/coronavirus-date',
      session: {
        editing: true,
        conditionGather: [],
      },
      journeyData: {
        setDataForPage: sinon.stub()
          .returns('something'),
      },
    };
    coronavirusDate(req);
    assert(req.journeyData.setDataForPage.called);
    expect(req.journeyData.setDataForPage.firstCall.firstArg).to.equal('coronavirus-other-condition');
    expect(req.journeyData.setDataForPage.firstCall.lastArg.coronavirusOtherCondition).to.equal('no');
  });
});
