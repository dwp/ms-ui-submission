const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const { assert, expect } = chai;

const genericDataUtils = rewire('../../../../app/lib/data-utils/genericDataUtils.js');

describe('genericDataUtils.convertToArrayAndFilterBlanks', () => {
  it('should exist', () => {
    expect(genericDataUtils.convertToArrayAndFilterBlanks).to.be.a('function');
  });

  it('should return undefined when passed no args', () => {
    expect(genericDataUtils.convertToArrayAndFilterBlanks()).to.equal(undefined);
  });

  it('should covert objects to arrays', () => {
    const obj = { a: 'a' };
    expect(genericDataUtils.convertToArrayAndFilterBlanks(obj)).to.eql(['a']);
  });

  it('should check nested objects', () => {
    const arr = [{
      a: 'a',
      b: {
        c: 'c',
      },
    }, {
      a: '',
      b: {
        c: '',
      },
    }];
    expect(genericDataUtils.convertToArrayAndFilterBlanks(arr).length).to.equal(1);
  });

  it('should not remove non empty objects', () => {
    const arr = [{
      a: 'a',
      b: 'b',
    }, {
      a: 'a',
      b: 'b',
    }, {
      a: 'a',
      b: 'b',
    }, {
      a: 'a',
      b: 'b',
    }];
    expect(genericDataUtils.convertToArrayAndFilterBlanks(arr)).to.deep.equal(arr);
  });

  it('should not remove partially empty objects', () => {
    const arr = [{
      a: 'a',
      b: 'b',
    }, {
      a: '',
      b: 'b',
    }, {
      a: 'a',
      b: 'b',
    }, {
      a: 'a',
      b: '',
    }];
    expect(genericDataUtils.convertToArrayAndFilterBlanks(arr)).to.deep.equal(arr);
  });

  it('should remove empty objects', () => {
    const arr = [{
      a: '',
      b: '',
    }, {
      a: 'a',
      b: 'b',
    }, {
      a: '',
      b: '',
    }, {
      a: 'a',
      b: '',
    }];
    expect(genericDataUtils.convertToArrayAndFilterBlanks(arr)).to.deep.equal([{
      a: 'a',
      b: 'b',
    }, {
      a: 'a',
      b: '',
    }]);
  });
});

describe('genericDataUtils.deleteIfPresent', () => {
  it('should exist', () => {
    expect(genericDataUtils.deleteIfPresent).to.be.a('function');
  });

  it('should return false if there is no data for the page provided', () => {
    const page = 'pensions-payment';
    const dataItems = [];
    const req = {
      journeyData: {
        getDataForPage: () => {
        },
      },
    };
    expect(genericDataUtils.deleteIfPresent(req, page, dataItems)).to.equal(false);
  });

  it('should delete the data items and return true if there is data for the page', () => {
    const page = 'pensions-payment';
    const dataItems = ['amount'];
    const req = {
      journeyData: {
        getDataForPage: () => ({ deductions: 'no' }),
        setDataForPage: sinon.stub(),
      },
    };
    expect(genericDataUtils.deleteIfPresent(req, page, dataItems)).to.equal(true);
    expect(req.journeyData.getDataForPage('pensions-payment').amount).to.equal(undefined);
  });
});

describe('genericDataUtils.cancelEdit', () => {
  let req;
  beforeEach(() => {
    req = {
      session: {
        editSection: '',
        editIndex: 0,
        voluntaryGather: [],
        employmentGather: [],
        pensionGather: [],
        insuranceGather: [],
      },
      journeyData: {
        setDataForPage: sinon.stub(),
        getData: (p) => {
          req.journeyData[p] = req.session.editSection;
        },
      },
    };
  });
  it('should set values for voluntary work if editSection is voluntary', () => {
    req.session.editSection = 'voluntary';
    req.session.voluntaryGather[0] = 'voluntaryData';
    const getVoluntaryFromJourneyData = sinon.stub()
      .returns('voluntaryData');
    /* eslint-disable-next-line no-underscore-dangle */
    genericDataUtils.__set__('getVoluntaryFromJourneyData', getVoluntaryFromJourneyData);
    const clearVoluntaryJourneyData = sinon.stub()
      .resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    genericDataUtils.__set__('clearVoluntaryJourneyData', clearVoluntaryJourneyData);
    genericDataUtils.cancelEdit(req);
    assert(getVoluntaryFromJourneyData.calledOnce);
    assert(clearVoluntaryJourneyData.calledOnce);
    assert(req.journeyData.setDataForPage.calledOnce);
  });
  it('should not set values for voluntary work if editSection is voluntary', () => {
    req.session.editSection = 'voluntary';
    req.session.voluntaryGather[0] = 'notVoluntaryData';
    const getVoluntaryFromJourneyData = sinon.stub()
      .returns('voluntaryData');
    /* eslint-disable-next-line no-underscore-dangle */
    genericDataUtils.__set__('getVoluntaryFromJourneyData', getVoluntaryFromJourneyData);
    const clearVoluntaryJourneyData = sinon.stub()
      .resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    genericDataUtils.__set__('clearVoluntaryJourneyData', clearVoluntaryJourneyData);
    genericDataUtils.cancelEdit(req);
    assert(getVoluntaryFromJourneyData.calledOnce);
    assert(clearVoluntaryJourneyData.notCalled);
    assert(req.journeyData.setDataForPage.notCalled);
  });
  it('should set values for paid work if editSection is employment', () => {
    req.session.editSection = 'employment';
    req.session.employmentGather[0] = 'employmentData';
    const getEmploymentFromJourneyData = sinon.stub()
      .returns('employmentData');
    /* eslint-disable-next-line no-underscore-dangle */
    genericDataUtils.__set__('getEmploymentFromJourneyData', getEmploymentFromJourneyData);
    const clearEmploymentJourneyData = sinon.stub()
      .resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    genericDataUtils.__set__('clearEmploymentJourneyData', clearEmploymentJourneyData);
    genericDataUtils.cancelEdit(req);
    assert(getEmploymentFromJourneyData.calledOnce);
    assert(clearEmploymentJourneyData.calledOnce);
    assert(req.journeyData.setDataForPage.calledOnce);
  });
  it('should not set values for paid work if editSection is employment', () => {
    req.session.editSection = 'employment';
    req.session.employmentGather[0] = 'notEmploymentData';
    const getEmploymentFromJourneyData = sinon.stub()
      .returns('employmentData');
    /* eslint-disable-next-line no-underscore-dangle */
    genericDataUtils.__set__('getEmploymentFromJourneyData', getEmploymentFromJourneyData);
    const clearEmploymentJourneyData = sinon.stub()
      .resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    genericDataUtils.__set__('clearEmploymentJourneyData', clearEmploymentJourneyData);
    genericDataUtils.cancelEdit(req);
    assert(getEmploymentFromJourneyData.calledOnce);
    assert(clearEmploymentJourneyData.notCalled);
    assert(req.journeyData.setDataForPage.notCalled);
  });
  it('should set values for pension if editSection is pension', () => {
    req.session.editSection = 'pension';
    req.session.pensionGather[0] = 'pensionData';
    const getPensionFromJourneyData = sinon.stub()
      .returns('pensionData');
    /* eslint-disable-next-line no-underscore-dangle */
    genericDataUtils.__set__('getPensionFromJourneyData', getPensionFromJourneyData);
    const clearPensionJourneyData = sinon.stub()
      .resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    genericDataUtils.__set__('clearPensionJourneyData', clearPensionJourneyData);
    genericDataUtils.cancelEdit(req);
    assert(getPensionFromJourneyData.calledOnce);
    assert(clearPensionJourneyData.calledOnce);
    assert(req.journeyData.setDataForPage.calledOnce);
  });
  it('should not set values for pension if editSection is pension', () => {
    req.session.editSection = 'pension';
    req.session.pensionGather[0] = 'notPensionData';
    const getPensionFromJourneyData = sinon.stub()
      .returns('pensionData');
    /* eslint-disable-next-line no-underscore-dangle */
    genericDataUtils.__set__('getPensionFromJourneyData', getPensionFromJourneyData);
    const clearPensionJourneyData = sinon.stub()
      .resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    genericDataUtils.__set__('clearPensionJourneyData', clearPensionJourneyData);
    genericDataUtils.cancelEdit(req);
    assert(getPensionFromJourneyData.calledOnce);
    assert(clearPensionJourneyData.notCalled);
    assert(req.journeyData.setDataForPage.notCalled);
  });
  it('should set values for insurance if editSection is insurance', () => {
    req.session.editSection = 'insurance';
    req.session.insuranceGather[0] = 'insuranceData';
    const getInsuranceFromJourneyData = sinon.stub()
      .returns('insuranceData');
    /* eslint-disable-next-line no-underscore-dangle */
    genericDataUtils.__set__('getInsuranceFromJourneyData', getInsuranceFromJourneyData);
    const clearInsuranceJourneyData = sinon.stub()
      .resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    genericDataUtils.__set__('clearInsuranceJourneyData', clearInsuranceJourneyData);
    genericDataUtils.cancelEdit(req);
    assert(getInsuranceFromJourneyData.calledOnce);
    assert(clearInsuranceJourneyData.calledOnce);
    assert(req.journeyData.setDataForPage.calledOnce);
  });
  it('should not set values for insurance if editSection is insurance', () => {
    req.session.editSection = 'insurance';
    req.session.insuranceGather[0] = 'notInsuranceData';
    const getInsuranceFromJourneyData = sinon.stub()
      .returns('insuranceData');
    /* eslint-disable-next-line no-underscore-dangle */
    genericDataUtils.__set__('getInsuranceFromJourneyData', getInsuranceFromJourneyData);
    const clearInsuranceJourneyData = sinon.stub()
      .resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    genericDataUtils.__set__('clearInsuranceJourneyData', clearInsuranceJourneyData);
    genericDataUtils.cancelEdit(req);
    assert(getInsuranceFromJourneyData.calledOnce);
    assert(clearInsuranceJourneyData.notCalled);
    assert(req.journeyData.setDataForPage.notCalled);
  });
});
