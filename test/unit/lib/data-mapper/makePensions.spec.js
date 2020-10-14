const chai = require('chai');

const { expect } = chai;
const makePensions = require('../../../../app/lib/data-mapper/makePensions.js');

describe('setting up pensions data for submission', () => {
  const pensionGather = [
    {
      providerRef: 'myref1',
      pensionProvider: 'mypenorg1',
      providerTel: '01234123456',
      providerAddress: {
        address1: 'testa',
        address2: 'testb',
        address3: 'testc',
        postcode: 'testd',
      },
      pensionStartDate: {
        dd: '01',
        mm: '01',
        yyyy: '2018',
      },
      amount: '400',
      deductions: 'no',
      frequency: 'weekly',
      inherited: 'no',
    },
    {
      providerRef: 'myref2',
      pensionProvider: 'mypenorg2',
      providerTel: '09876987654',
      providerAddress: {
        address1: 'teste',
        address2: 'testf',
        address3: 'testg',
        postcode: 'testh',
      },
      pensionStartDate: {
        dd: '',
        mm: '',
        yyyy: '',
      },
      deductions: 'yes',
      amountBeforeDeductions: '200',
      amountAfterDeductions: '150',
      deductionsDetails: {
        amount: '50',
        detail: 'testj',
      },
      frequency: 'monthly',
      inherited: 'yes',
    }];
  it('should return an object with appropriate properties', () => {
    const pen = makePensions(pensionGather);
    expect(pen[0]).to.eql({
      pension_provider: 'mypenorg1',
      provider_ref: 'myref1',
      provider_tel: '01234123456',
      provider_address: {
        lines: ['testa', 'testb', 'testc'],
        premises: '',
        postcode: 'testd',
      },
      start_date: '2018-01-01',
      deductions: 'no',
      amount_gross: '400',
      frequency: 'weekly',
      inherited: 'no',
    });
    expect(pen[1]).to.eql({
      pension_provider: 'mypenorg2',
      provider_ref: 'myref2',
      provider_tel: '09876987654',
      provider_address: {
        lines: ['teste', 'testf', 'testg'],
        premises: '',
        postcode: 'testh',
      },
      start_date: '',
      amount_gross: '200',
      amount_net: '150',
      deduction_details: {
        amount: '50',
        detail: 'testj',
      },
      deductions: 'yes',
      frequency: 'monthly',
      inherited: 'yes',
    });
  });
});
