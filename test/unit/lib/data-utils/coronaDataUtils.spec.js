const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const { expect } = chai;

const coronaDataUtils = rewire('../../../../app/lib/data-utils/coronaDataUtils.js');

describe('coronaDataUtils.setCoronaExistingConditionsToYes', () => {
  it('should exist', () => {
    expect(coronaDataUtils.setCoronaExistingConditionsToYes).to.be.a('function');
  });

  it('should update the coronavirus-other-condition.coronavirusOtherCondition to yes', () => {
    const obj = {};
    const req = {
      journeyData: {
        getDataForPage: sinon.stub().returns(obj),
        setDataForPage: () => {
          obj.coronavirusOtherCondition = 'yes';
        },
      },
    };
    coronaDataUtils.setCoronaExistingConditionsToYes(req.journeyData);
    expect(req.journeyData.getDataForPage('coronavirus-other-condition').coronavirusOtherCondition).to.equal('yes');
  });
});
