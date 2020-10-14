const chai = require('chai');

const { expect } = chai;
const makeConditions = require('../../../../app/lib/data-mapper/makeConditions.js');

describe('setting up applicant data for submission', () => {
  const journeyDataValues = {
    conditions: {
      conditions: [{
        name: 'test1',
        conditionStartDate: {
          dd: '01',
          mm: '1',
          yyyy: '2001',
        },
      },
      {
        name: 'test2',
        conditionStartDate: {
          dd: '02',
          mm: '2',
          yyyy: '2002',
        },
      }],
    },
  };
  const journeyData = {
    getDataForPage: (page) => journeyDataValues[page],
  };
  it('should build an array of conditions containing values from inputs', () => {
    const conds = makeConditions(journeyData);
    expect(conds[0]).to.have.property('name', 'test1');
    expect(conds[0]).to.have.property('start_date', '2001-01-01');
    expect(conds[1]).to.have.property('name', 'test2');
    expect(conds[1]).to.have.property('start_date', '2002-02-02');
  });
});
