const chai = require('chai');

const { expect } = chai;
const makeInsurance = require('../../../../app/lib/data-mapper/makeInsurance.js');

describe('setting up insurance data for submission', () => {
  const insuranceGather = [
    {
      providerRef: 'myref1',
      insuranceProvider: 'myinsorg1',
      providerTel: '01234123456',
      providerAddress: {
        address1: 'testa',
        address2: 'testb',
        address3: 'testc',
        postcode: 'testd',
      },
      endDate: {
        dd: '01',
        mm: '01',
        yyyy: '2018',
      },
      amount: '400',
      frequency: 'weekly',
      premiums: 'no',
      stillWork: 'no',
    },
    {
      providerRef: 'myref2',
      insuranceProvider: 'myinsorg2',
      providerTel: '09876987654',
      providerAddress: {
        address1: 'teste',
        address2: 'testf',
        address3: 'testg',
        postcode: 'testh',
      },
      amount: '200',
      frequency: 'monthly',
      premiums: 'yes',
      stillWork: 'yes',
    }];
  it('should return an object with appropriate properties', () => {
    const pen = makeInsurance(insuranceGather);
    expect(pen[0]).to.eql({
      insurance_provider: 'myinsorg1',
      provider_ref: 'myref1',
      provider_tel: '01234123456',
      provider_address: {
        lines: ['testa', 'testb', 'testc'],
        premises: '',
        postcode: 'testd',
      },
      amount: '400',
      frequency: 'weekly',
      premiums: 'no',
      employment_end_date: '2018-01-01',
    });
    expect(pen[1]).to.eql({
      insurance_provider: 'myinsorg2',
      provider_ref: 'myref2',
      provider_tel: '09876987654',
      provider_address: {
        lines: ['teste', 'testf', 'testg'],
        premises: '',
        postcode: 'testh',
      },
      amount: '200',
      frequency: 'monthly',
      premiums: 'yes',
    });
  });
});
