const chai = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const { assert, expect } = chai;

const voluntaryDataUtils = rewire('../../../../app/lib/data-utils/voluntaryDataUtils.js');

describe('voluntaryDataUtils.getVoluntaryFromJourneyData', () => {
  it('should build a valid voluntary object', () => {
    const jd = {
      'voluntary-work-details': {
        organisationName: 'test',
        organisationAddress: {
          address1: 'address1',
          address2: 'address2',
          address3: 'address3',
          postcode: 'postcode',
        },
      },
      'voluntary-work-role': {
        role: 'test',
      },
      'voluntary-work-hours': {
        sameHours: 'yes',
        hours: 'test',
      },
    };
    expect(voluntaryDataUtils.getVoluntaryFromJourneyData(jd)).to.eql({
      organisationName: 'test',
      organisationAddress: {
        address1: 'address1',
        address2: 'address2',
        address3: 'address3',
        postcode: 'postcode',
      },
      role: 'test',
      sameHours: 'yes',
      hours: 'test',
    });
  });
});

describe('voluntaryDataUtils.populateVoluntaryJourneyData', () => {
  it('should build a valid voluntary object', () => {
    const jd = {
      data: {},
      setDataForPage: (p, d) => {
        jd.data[p] = d;
      },
    };
    voluntaryDataUtils.populateVoluntaryJourneyData(jd, {
      organisationName: 'test',
      organisationAddress: {
        address1: 'address1',
        address2: 'address2',
        address3: 'address3',
        postcode: 'postcode',
      },
      role: 'test',
      sameHours: 'yes',
      hours: 'test',
    });
    expect(jd.data).to.eql({
      'voluntary-work': {
        other: 'yes',
        screen: 'voluntary-work-other',
      },
      'voluntary-work-details': {
        organisationName: 'test',
        organisationAddress: {
          address1: 'address1',
          address2: 'address2',
          address3: 'address3',
          postcode: 'postcode',
        },
      },
      'voluntary-work-role': {
        role: 'test',
      },
      'voluntary-work-hours': {
        sameHours: 'yes',
        hours: 'test',
      },
    });
  });
});

describe('voluntaryDataUtils.clearVoluntaryJourneyData', () => {
  it('should remove voluntary journey data', () => {
    const req = {
      journeyData: {
        setDataForPage: (p, d) => {
          req.journeyData.data[p] = d;
        },
        data: {
          'voluntary-work': {},
          'voluntary-work-details': {},
          'voluntary-work-role': {},
          'voluntary-work-hours': {},
        },
      },
    };
    voluntaryDataUtils.clearVoluntaryJourneyData(req);
    expect(req.journeyData.data).to.eql({
      'voluntary-work': undefined,
      'voluntary-work-details': undefined,
      'voluntary-work-role': undefined,
      'voluntary-work-hours': undefined,
    });
  });
});

describe('voluntaryDataUtils.updateSpecificVoluntary', () => {
  it('should update a specific instance of voluntary work to the voluntary Gather and call relevant functions', () => {
    const req = {
      journeyData: {
        getData: sinon.stub(),
        setDataForPage: sinon.stub(),
      },
      session: {
        editIndex: 0,
        voluntaryGather: [],
      },
    };
    const getVoluntaryFromJourneyData = sinon.stub().returns('data');
    /* eslint-disable-next-line no-underscore-dangle */
    voluntaryDataUtils.__set__('getVoluntaryFromJourneyData', getVoluntaryFromJourneyData);
    const clearVoluntaryJourneyData = sinon.stub().resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    voluntaryDataUtils.__set__('clearVoluntaryJourneyData', clearVoluntaryJourneyData);
    voluntaryDataUtils.updateSpecificVoluntary(req);
    assert(getVoluntaryFromJourneyData.calledOnce);
    assert(clearVoluntaryJourneyData.calledOnce);
    assert(req.journeyData.setDataForPage.calledOnce);
    assert(req.journeyData.getData.calledOnce);
    expect(req.session.voluntaryGather[0]).to.equal('data');
  });
});

describe('voluntaryDataUtils.addVoluntaryToGather', () => {
  it('should add an instance of voluntary work to the voluntary Gather and call relevant functions', () => {
    const req = {
      journeyData: {
        getData: sinon.stub(),
      },
      session: {
        voluntaryGather: [],
      },
    };
    const getVoluntaryFromJourneyData = sinon.stub().returns('data');
    /* eslint-disable-next-line no-underscore-dangle */
    voluntaryDataUtils.__set__('getVoluntaryFromJourneyData', getVoluntaryFromJourneyData);
    const clearVoluntaryJourneyData = sinon.stub().resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    voluntaryDataUtils.__set__('clearVoluntaryJourneyData', clearVoluntaryJourneyData);
    voluntaryDataUtils.addVoluntaryToGather(req);
    assert(getVoluntaryFromJourneyData.calledOnce);
    assert(clearVoluntaryJourneyData.calledOnce);
    assert(req.journeyData.getData.calledOnce);
    expect(req.session.voluntaryGather[0]).to.equal('data');
  });
});
