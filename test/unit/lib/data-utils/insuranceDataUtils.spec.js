const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const { assert, expect } = chai;

const insuranceDataUtils = rewire('../../../../app/lib/data-utils/insuranceDataUtils.js');

describe('insuranceDataUtils.getInsuranceFromJourneyData', () => {
  it('should build a valid insurance object', () => {
    const jd = {
      'insurance-details': {
        insuranceProvider: 'test',
        providerRef: 'ref',
        providerTel: '0987654321',
        providerAddress: {
          address1: 'address1',
          address2: 'address2',
          address3: 'address3',
          postcode: 'postcode',
        },
      },
      'insurance-payment': {
        amount: 'test',
        frequency: 'test',
      },
      'insurance-premiums': {
        premiums: 'no',
      },
      'insurance-employer': {
        stillWork: 'no',
        endDate: 'test',
      },
    };
    expect(insuranceDataUtils.getInsuranceFromJourneyData(jd)).to.eql({
      insuranceProvider: 'test',
      providerRef: 'ref',
      providerTel: '0987654321',
      providerAddress: {
        address1: 'address1',
        address2: 'address2',
        address3: 'address3',
        postcode: 'postcode',
      },
      amount: 'test',
      frequency: 'test',
      premiums: 'no',
      stillWork: 'no',
      endDate: 'test',
    });
  });
});

describe('insuranceDataUtils.populateInsuranceJourneyData', () => {
  it('should build a valid insurance object', () => {
    const jd = {
      data: {},
      setDataForPage: (p, d) => {
        jd.data[p] = d;
      },
    };
    insuranceDataUtils.populateInsuranceJourneyData(jd, {
      insuranceProvider: 'test',
      providerRef: 'ref',
      providerTel: '0987654321',
      providerAddress: {
        address1: 'address1',
        address2: 'address2',
        address3: 'address3',
        postcode: 'postcode',
      },
      amount: 'test',
      frequency: 'test',
      premiums: 'no',
      stillWork: 'no',
      endDate: 'test',
    });
    expect(jd.data).to.eql({
      insurance: {
        other: 'yes',
        screen: 'insurance-other',
      },
      'insurance-details': {
        insuranceProvider: 'test',
        providerRef: 'ref',
        providerTel: '0987654321',
        providerAddress: {
          address1: 'address1',
          address2: 'address2',
          address3: 'address3',
          postcode: 'postcode',
        },
      },
      'insurance-payment': {
        amount: 'test',
        frequency: 'test',
      },
      'insurance-premiums': {
        premiums: 'no',
      },
      'insurance-employer': {
        stillWork: 'no',
        endDate: 'test',
      },
    });
  });
});

describe('insuranceDataUtils.clearInsuranceJourneyData', () => {
  it('should remove insurance journey data', () => {
    const req = {
      journeyData: {
        setDataForPage: (p, d) => {
          req.journeyData.data[p] = d;
        },
        data: {
          insurance: {},
          'insurance-details': {},
          'insurance-premiums': {},
          'insurance-employer': {},
          'insurance-payment': {},
        },
      },
    };
    insuranceDataUtils.clearInsuranceJourneyData(req);
    expect(req.journeyData.data).to.eql({
      insurance: undefined,
      'insurance-details': undefined,
      'insurance-premiums': undefined,
      'insurance-employer': undefined,
      'insurance-payment': undefined,
    });
  });
});

describe('insuranceDataUtils.updateSpecificInsurance', () => {
  it('should update a specific instance of insurance to the insurance Gather and call relevant functions', () => {
    const req = {
      journeyData: {
        getData: sinon.stub(),
        setDataForPage: sinon.stub(),
      },
      session: {
        editIndex: 0,
        insuranceGather: [],
      },
    };
    const getInsuranceFromJourneyData = sinon.stub().returns('data');
    /* eslint-disable-next-line no-underscore-dangle */
    insuranceDataUtils.__set__('getInsuranceFromJourneyData', getInsuranceFromJourneyData);
    const clearInsuranceJourneyData = sinon.stub().resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    insuranceDataUtils.__set__('clearInsuranceJourneyData', clearInsuranceJourneyData);
    insuranceDataUtils.updateSpecificInsurance(req);
    assert(getInsuranceFromJourneyData.calledOnce);
    assert(clearInsuranceJourneyData.calledOnce);
    assert(req.journeyData.setDataForPage.calledOnce);
    assert(req.journeyData.getData.calledOnce);
    expect(req.session.insuranceGather[0]).to.equal('data');
  });
});

describe('insuranceDataUtils.addInsuranceToGather', () => {
  it('should add an instance of insurance to the insurance Gather and call relevant functions', () => {
    const req = {
      journeyData: {
        getData: sinon.stub(),
      },
      session: {
        insuranceGather: [],
      },
    };
    const getInsuranceFromJourneyData = sinon.stub().returns('data');
    /* eslint-disable-next-line no-underscore-dangle */
    insuranceDataUtils.__set__('getInsuranceFromJourneyData', getInsuranceFromJourneyData);
    const clearInsuranceJourneyData = sinon.stub().resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    insuranceDataUtils.__set__('clearInsuranceJourneyData', clearInsuranceJourneyData);
    insuranceDataUtils.addInsuranceToGather(req);
    assert(getInsuranceFromJourneyData.calledOnce);
    assert(clearInsuranceJourneyData.calledOnce);
    assert(req.journeyData.getData.calledOnce);
    expect(req.session.insuranceGather[0]).to.equal('data');
  });
});
