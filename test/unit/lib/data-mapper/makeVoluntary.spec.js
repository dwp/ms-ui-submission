const chai = require('chai');

const { expect } = chai;
const makeVoluntary = require('../../../../app/lib/data-mapper/makeVoluntary.js');

describe('setting up voluntary work data for submission', () => {
  const voluntaryGather = [
    {
      organisationName: 'myvolorg1',
      organisationAddress: {
        address1: 'testa',
        address2: 'testb',
        address3: 'testc',
        postcode: 'testd',
      },
      sameHours: 'yes',
      hours: '10',
      role: 'rolea',
    },
    {
      organisationName: 'myvolorg2',
      organisationAddress: {
        address1: 'teste',
        address2: 'testf',
        address3: 'testg',
        postcode: 'testh',
      },
      sameHours: 'no',
      hours: '',
      role: 'roleb',
    }];
  it('should return an object with appropriate properties', () => {
    const vol = makeVoluntary(voluntaryGather);
    expect(vol[0]).to.eql({
      organisation_name: 'myvolorg1',
      organisation_address: {
        lines: ['testa', 'testb', 'testc'],
        premises: '',
        postcode: 'testd',
      },
      same_hours: 'yes',
      hours: '10',
      role: 'rolea',
    });
    expect(vol[1]).to.eql({
      organisation_name: 'myvolorg2',
      organisation_address: {
        lines: ['teste', 'testf', 'testg'],
        premises: '',
        postcode: 'testh',
      },
      same_hours: 'no',
      role: 'roleb',
    });
  });
});
