import { expect } from 'chai';
import makeConditions from '../../../../src/lib/data-mapper/makeConditions.js';

describe('setting up condition data for submission', () => {
  const conditionGather = [
    {
      conditionName: 'test1',
      conditionStartDate: {
        dd: '01',
        mm: '1',
        yyyy: '2001',
      },
    },
    {
      conditionName: 'test2',
      conditionStartDate: {
        dd: '02',
        mm: '2',
        yyyy: '2002',
      },
    },
  ];

  it('should return an object with appropriate properties', () => {
    const condition = makeConditions(conditionGather);
    expect(condition[0]).to.eql({
      name: 'test1',
      start_date: '2001-01-01',
    });
    expect(condition[1]).to.eql({
      name: 'test2',
      start_date: '2002-02-02',
    });
  });
});
