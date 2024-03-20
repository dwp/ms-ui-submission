import sinon from 'sinon';
import { assert, expect } from 'chai';
import voluntaryDataUtils from '../../../../src/lib/data-utils/voluntaryDataUtils.js';
import {JourneyContext} from "@dwp/govuk-casa";

let sandbox;

describe('voluntaryDataUtils.getVoluntaryFromJourneyData', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext').resolves();
    });
    afterEach(() => {
        sandbox.restore();
    });
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
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext').resolves();
    });
    afterEach(() => {
        sandbox.restore();
    });
  it('should build a valid voluntary object', () => {
    const jd = {
      data: {},
      setDataForPage: (p, d) => {
        jd.data[p] = d;
      },
    };
      const req = {
          casa: {
              journeyContext: {
                  setDataForPage: (p, d) => {
                      req.casa.journeyContext.data[p] = d;
                  },
                  data: {
                      'voluntary-work-details': {
                          organisationName: 'new',
                          organisationAddress: {},
                      },
                  },
              },
          },
          session: {
              save: () => {},
              editIndex: '0',
              voluntaryGather: [{ organisationName: 'old' }],
          },
      };
    voluntaryDataUtils.populateVoluntaryJourneyData(req, jd, {
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
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext').resolves();
    });
    afterEach(() => {
        sandbox.restore();
    });
  it('should remove voluntary journey data', () => {
    const req = {
        session: {
            save: () => {}
        },
      casa: {
        journeyContext: {
          setDataForPage: (p, d) => {
            req.casa.journeyContext.data[p] = d;
          },
          data: {
            'voluntary-work': {},
            'voluntary-work-details': {},
            'voluntary-work-role': {},
            'voluntary-work-hours': {},
          },
        },
      },
    };
    voluntaryDataUtils.clearVoluntaryJourneyData(req);
    expect(req.casa.journeyContext.data).to.eql({
      'voluntary-work': {},
      'voluntary-work-details': {},
      'voluntary-work-role': {},
      'voluntary-work-hours': {},
    });
  });
});

describe('voluntaryDataUtils.updateSpecificVoluntary', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext').resolves();
    });
    afterEach(() => {
        sandbox.restore();
    });
  it('should update a specific instance of voluntary work to the voluntary Gather and call relevant functions', () => {
    const req = {
      casa: {
        journeyContext: {
          setDataForPage: (p, d) => {
            req.casa.journeyContext.data[p] = d;
          },
          data: {
            'voluntary-work-details': {
              organisationName: 'new',
              organisationAddress: {},
            },
          },
        },
      },
      session: {
        save: () => {},
        editIndex: '0',
        voluntaryGather: [{ organisationName: 'old' }],
      },
    };
    voluntaryDataUtils.updateSpecificVoluntary(req);
    expect(req.session.voluntaryGather[0].organisationName).to.equal('new');
  });
});

describe('voluntaryDataUtils.addVoluntaryToGather', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext').resolves();
    });
    afterEach(() => {
        sandbox.restore();
    });
  it('should add an instance of voluntary work to the voluntary Gather and call relevant functions', () => {
    const req = {
      casa: {
        journeyContext: {
          setDataForPage: (p, d) => {
            req.casa.journeyContext.data[p] = d;
          },
          data: {
            'voluntary-work-details': {
              organisationName: 'new',
              organisationAddress: {},
            },
          },
        },
      },
      session: {
        save: () => {},
        voluntaryGather: [],
      },
    };
    voluntaryDataUtils.addVoluntaryToGather(req);
    expect(req.session.voluntaryGather[0].organisationName).to.equal('new');
  });
});
