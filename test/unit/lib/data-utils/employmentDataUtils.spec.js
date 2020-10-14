const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const { assert, expect } = chai;

const employmentDataUtils = rewire('../../../../app/lib/data-utils/employmentDataUtils.js');

describe('employmentDataUtils.getEmploymentFromJourneyData', () => {
  it('should build a valid employment object', () => {
    const jd = {
      'employment-details': {
        jobTitle: 'test',
        employerName: 'test',
        employerTel: 'test',
        employerAddress: {
          address1: 'address1',
          address2: 'address2',
          address3: 'address3',
          postcode: 'postcode',
        },
      },
      'employment-off-sick': {
        offSick: 'no',
      },
      'employment-status': {
        workTypes: [],
      },
      'employment-hours': {
        sameHours: 'yes',
        hours: 'test',
      },
      'employment-pay-frequency-samehours': {
        frequency: 'test',
        netPay: 'test',
      },
      'employment-support': {
        support: 'test',
      },
      'employment-expenses': {
        expenses: 'yes',
      },
      'employment-expenses-details': {
        expensesDetails: 'test',
      },
    };
    expect(employmentDataUtils.getEmploymentFromJourneyData(jd)).to.eql({
      jobTitle: 'test',
      employerName: 'test',
      employerTel: 'test',
      employerAddress: {
        address1: 'address1',
        address2: 'address2',
        address3: 'address3',
        postcode: 'postcode',
      },
      offSick: 'no',
      workTypes: [],
      sameHours: 'yes',
      hours: 'test',
      frequency: 'test',
      netPay: 'test',
      support: 'test',
      expenses: 'yes',
      expensesDetails: 'test',
    });
  });
});

describe('employmentDataUtils.populateEmploymentJourneyData', () => {
  it('should build a valid employment object', () => {
    const jd = {
      data: {},
      setDataForPage: (p, d) => {
        jd.data[p] = d;
      },
    };
    employmentDataUtils.populateEmploymentJourneyData(jd, {
      jobTitle: 'test',
      employerName: 'test',
      employerTel: 'test',
      employerAddress: {
        address1: 'address1',
        address2: 'address2',
        address3: 'address3',
        postcode: 'postcode',
      },
      offSick: 'no',
      workTypes: [],
      sameHours: 'no',
      frequency: 'test',
      netPay: 'test',
      support: 'test',
      expenses: 'yes',
      expensesDetails: 'test',
    });
    expect(jd.data).to.eql({
      employed: {
        other: 'yes',
        screen: 'employed-other',
      },
      'employment-details': {
        jobTitle: 'test',
        employerName: 'test',
        employerTel: 'test',
        employerAddress: {
          address1: 'address1',
          address2: 'address2',
          address3: 'address3',
          postcode: 'postcode',
        },
      },
      'employment-off-sick': {
        offSick: 'no',
      },
      'employment-status': {
        workTypes: [],
      },
      'employment-hours': {
        sameHours: 'no',
      },
      'employment-pay-frequency-other': {
        frequency: 'test',
        netPay: 'test',
      },
      'employment-support': {
        support: 'test',
      },
      'employment-expenses': {
        expenses: 'yes',
      },
      'employment-expenses-details': {
        expensesDetails: 'test',
      },
    });
  });
});

describe('employmentDataUtils.clearEmploymentJourneyData', () => {
  it('should remove employment journey data', () => {
    const req = {
      journeyData: {
        setDataForPage: (p, d) => {
          req.journeyData.data[p] = d;
        },
        data: {
          employed: {},
          'employment-details': {},
          'employment-off-sick': {},
          'employment-last-work': {},
          'employment-status': {},
          'employment-hours': {},
          'employment-pay-frequency-samehours': {},
          'employment-support': {},
          'employment-expenses': {},
          'employment-expenses-details': {},
          'employment-pay-frequency-other': {},
        },
      },
    };
    employmentDataUtils.clearEmploymentJourneyData(req);
    expect(req.journeyData.data).to.eql({
      employed: undefined,
      'employment-details': undefined,
      'employment-off-sick': undefined,
      'employment-last-work': undefined,
      'employment-status': undefined,
      'employment-hours': undefined,
      'employment-pay-frequency-samehours': undefined,
      'employment-support': undefined,
      'employment-expenses': undefined,
      'employment-expenses-details': undefined,
      'employment-pay-frequency-other': undefined,
    });
  });
});

describe('employmentDataUtils.updateSpecificEmployment', () => {
  it('should update a specific instance of paid work to the employment Gather and call relevant functions', () => {
    const req = {
      journeyData: {
        getData: sinon.stub(),
        setDataForPage: sinon.stub(),
      },
      session: {
        editIndex: 0,
        employmentGather: [],
      },
    };
    const getEmploymentFromJourneyData = sinon.stub().returns('data');
    /* eslint-disable-next-line no-underscore-dangle */
    employmentDataUtils.__set__('getEmploymentFromJourneyData', getEmploymentFromJourneyData);
    const clearEmploymentJourneyData = sinon.stub().resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    employmentDataUtils.__set__('clearEmploymentJourneyData', clearEmploymentJourneyData);
    employmentDataUtils.updateSpecificEmployment(req);
    assert(getEmploymentFromJourneyData.calledOnce);
    assert(clearEmploymentJourneyData.calledOnce);
    assert(req.journeyData.setDataForPage.calledOnce);
    assert(req.journeyData.getData.calledOnce);
    expect(req.session.employmentGather[0]).to.equal('data');
  });
});

describe('employmentDataUtils.addEmploymentToGather', () => {
  it('should add an instance of paid work to the employment Gather and call relevant functions', () => {
    const req = {
      journeyData: {
        getData: sinon.stub(),
      },
      session: {
        employmentGather: [],
      },
    };
    const getEmploymentFromJourneyData = sinon.stub().returns('data');
    /* eslint-disable-next-line no-underscore-dangle */
    employmentDataUtils.__set__('getEmploymentFromJourneyData', getEmploymentFromJourneyData);
    const clearEmploymentJourneyData = sinon.stub().resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    employmentDataUtils.__set__('clearEmploymentJourneyData', clearEmploymentJourneyData);
    employmentDataUtils.addEmploymentToGather(req);
    assert(getEmploymentFromJourneyData.calledOnce);
    assert(clearEmploymentJourneyData.calledOnce);
    assert(req.journeyData.getData.calledOnce);
    expect(req.session.employmentGather[0]).to.equal('data');
  });
});
