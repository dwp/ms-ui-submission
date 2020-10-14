const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const { assert, expect } = chai;

const pensionDataUtils = rewire('../../../../app/lib/data-utils/pensionDataUtils.js');

describe('pensionDataUtils.getPensionFromJourneyData', () => {
  it('should build a valid pension object', () => {
    const jd = {
      'pension-details': {
        pensionProvider: 'provider',
        providerRef: 'ref',
        providerTel: '0987654321',
        providerAddress: {
          address1: 'address1',
          address2: 'address2',
          address3: 'address3',
          postcode: 'postcode',
        },
      },
      'pension-start': {
        pensionStartDate: 'test',
      },
      'pension-deductions': {
        deductions: 'yes',
      },
      'pension-frequency': {
        frequency: 'frequency',
      },
      'pension-inherited': {
        inherited: 'yes',
      },
      'pension-deductions-details': {
        deductionsDetails: [],
      },
      'pension-payment': {
        amountBeforeDeductions: '123',
        amountAfterDeductions: '123',
      },
    };
    expect(pensionDataUtils.getPensionFromJourneyData(jd)).to.eql({
      pensionProvider: 'provider',
      providerRef: 'ref',
      providerTel: '0987654321',
      providerAddress: {
        address1: 'address1',
        address2: 'address2',
        address3: 'address3',
        postcode: 'postcode',
      },
      pensionStartDate: 'test',
      deductions: 'yes',
      frequency: 'frequency',
      inherited: 'yes',
      deductionsDetails: [],
      amountBeforeDeductions: '123',
      amountAfterDeductions: '123',
    });
  });
});


describe('pensionDataUtils.populatePensionJourneyData', () => {
  it('should build a valid voluntary object', () => {
    const jd = {
      data: {},
      setDataForPage: (p, d) => {
        jd.data[p] = d;
      },
    };
    pensionDataUtils.populatePensionJourneyData(jd, {
      pensionProvider: 'provider',
      providerRef: 'ref',
      providerTel: '0987654321',
      providerAddress: {
        address1: 'address1',
        address2: 'address2',
        address3: 'address3',
        postcode: 'postcode',
      },
      pensionStartDate: 'test',
      deductions: 'yes',
      frequency: 'frequency',
      inherited: 'yes',
      deductionsDetails: [],
      amountBeforeDeductions: '123',
      amountAfterDeductions: '123',
    });
    expect(jd.data).to.eql({
      pension: {
        other: 'yes',
        screen: 'pension-other',
      },
      'pension-details': {
        pensionProvider: 'provider',
        providerRef: 'ref',
        providerTel: '0987654321',
        providerAddress: {
          address1: 'address1',
          address2: 'address2',
          address3: 'address3',
          postcode: 'postcode',
        },
      },
      'pension-start': {
        pensionStartDate: 'test',
      },
      'pension-deductions': {
        deductions: 'yes',
      },
      'pension-frequency': {
        frequency: 'frequency',
      },
      'pension-inherited': {
        inherited: 'yes',
      },
      'pension-deductions-details': {
        deductionsDetails: [],
      },
      'pension-payment': {
        amountBeforeDeductions: '123',
        amountAfterDeductions: '123',
      },
    });
  });
});

describe('pensionDataUtils.clearPensionJourneyData', () => {
  it('should remove pension journey data', () => {
    const req = {
      journeyData: {
        setDataForPage: (p, d) => {
          req.journeyData.data[p] = d;
        },
        data: {
          pension: {},
          'pension-details': {},
          'pension-start': {},
          'pension-frequency': {},
          'pension-deductions': {},
          'pension-deductions-details': {},
          'pension-payment': {},
          'pension-inherited': {},
        },
      },
    };
    pensionDataUtils.clearPensionJourneyData(req);
    expect(req.journeyData.data).to.eql({
      pension: undefined,
      'pension-details': undefined,
      'pension-start': undefined,
      'pension-frequency': undefined,
      'pension-deductions': undefined,
      'pension-deductions-details': undefined,
      'pension-payment': undefined,
      'pension-inherited': undefined,
    });
  });
});

describe('pensionDataUtils.updateSpecificPension', () => {
  it('should update a specific instance of pension to the pension Gather and call relevant functions', () => {
    const req = {
      journeyData: {
        getData: sinon.stub(),
        setDataForPage: sinon.stub(),
      },
      session: {
        editIndex: 0,
        pensionGather: [],
      },
    };
    const getPensionFromJourneyData = sinon.stub().returns('data');
    /* eslint-disable-next-line no-underscore-dangle */
    pensionDataUtils.__set__('getPensionFromJourneyData', getPensionFromJourneyData);
    const clearPensionJourneyData = sinon.stub().resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    pensionDataUtils.__set__('clearPensionJourneyData', clearPensionJourneyData);
    pensionDataUtils.updateSpecificPension(req);
    assert(getPensionFromJourneyData.calledOnce);
    assert(clearPensionJourneyData.calledOnce);
    assert(req.journeyData.setDataForPage.calledOnce);
    assert(req.journeyData.getData.calledOnce);
    expect(req.session.pensionGather[0]).to.equal('data');
  });
});

describe('pensionDataUtils.addPensionToGather', () => {
  it('should add an instance of pension to the pension Gather and call relevant functions', () => {
    const req = {
      journeyData: {
        getData: sinon.stub(),
      },
      session: {
        pensionGather: [],
      },
    };
    const getPensionFromJourneyData = sinon.stub().returns('data');
    /* eslint-disable-next-line no-underscore-dangle */
    pensionDataUtils.__set__('getPensionFromJourneyData', getPensionFromJourneyData);
    const clearPensionJourneyData = sinon.stub().resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    pensionDataUtils.__set__('clearPensionJourneyData', clearPensionJourneyData);
    pensionDataUtils.addPensionToGather(req);
    assert(getPensionFromJourneyData.calledOnce);
    assert(clearPensionJourneyData.calledOnce);
    assert(req.journeyData.getData.calledOnce);
    expect(req.session.pensionGather[0]).to.equal('data');
  });
});
