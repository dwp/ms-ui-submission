const chai = require('chai');

const { expect } = chai;
const makeEmployments = require('../../../../app/lib/data-mapper/makeEmployments.js');

describe('setting up employments data for submission', () => {
  const employmentGather = [
    {
      jobTitle: 'myjob1',
      employerName: 'myemp1',
      employerTel: '01234512345',
      employerAddress: {
        address1: 'testa',
        address2: 'testb',
        address3: 'testc',
        postcode: 'testd',
      },
      workTypes: ['employee', 'director'],
      offSick: 'yes',
      lastWorkedDate: {
        dd: '01',
        mm: '01',
        yyyy: '2018',
      },
    },
    {
      jobTitle: 'myjob2',
      employerName: 'myemp2',
      employerTel: '0987698765',
      employerAddress: {
        address1: 'teste',
        address2: 'testf',
        address3: 'testg',
        postcode: 'testh',
      },
      workTypes: ['employee'],
      offSick: 'no',
      sameHours: 'yes',
      hours: '20',
      netPay: '400',
      support: 'no',
      frequency: 'weekly',
      expenses: 'yes',
      expensesDetails: 'Taxi fare',
    }];
  it('should return an object with appropriate properties', () => {
    const emp = makeEmployments(employmentGather);
    expect(emp[0]).to.eql({
      job_title: 'myjob1',
      employer_name: 'myemp1',
      employer_tel: '01234512345',
      employer_address: {
        lines: ['testa', 'testb', 'testc'],
        premises: '',
        postcode: 'testd',
      },
      employment_status: ['employee', 'director'],
      off_sick: 'yes',
      last_worked_date: '2018-01-01',
    });
    expect(emp[1]).to.eql({
      job_title: 'myjob2',
      employer_name: 'myemp2',
      employer_tel: '0987698765',
      employer_address: {
        lines: ['teste', 'testf', 'testg'],
        premises: '',
        postcode: 'testh',
      },
      employment_status: ['employee'],
      off_sick: 'no',
      same_hours: 'yes',
      hours: '20',
      net_pay: '400',
      support: 'no',
      frequency: 'weekly',
      expenses_question: 'yes',
      expenses_details: 'Taxi fare',
    });
  });
});
