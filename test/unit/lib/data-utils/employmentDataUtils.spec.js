import sinon from 'sinon';
import { assert, expect } from 'chai';
import employmentDataUtils from '../../../../src/lib/data-utils/employmentDataUtils.js';
import {JourneyContext} from "@dwp/govuk-casa";

let sandbox;

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
      selfEmployed: false,
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
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext').resolves();
    });
    afterEach(() => {
        sandbox.restore();
    });
  it('should build a valid employment object', () => {
      const req = {
          casa: {
              journeyContext: {
                  setDataForPage: (p, d) => {
                      req.casa.journeyContext.data[p] = d;
                  },
                  data: {
                    employed : { other: 'yes', employed : 'yes' }
                  },
              },
          },
          session: {
              save: () => {},
          },
      };
    const jd = {
      data: {},
      setDataForPage: (p, d) => {
        jd.data[p] = d;
      },
    };
    employmentDataUtils.populateEmploymentJourneyData(req, jd, {
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
        employed: 'yes',
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
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext').resolves();
    });
    afterEach(() => {
        sandbox.restore();
    });
  it('should remove employment journey data', () => {
    const req = {
      session: {
          save: () => {},
      },
      casa: {
        journeyContext: {
          setDataForPage: (p, d) => {
            req.casa.journeyContext.data[p] = undefined;
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
      },
    };
    employmentDataUtils.clearEmploymentJourneyData(req);
    expect(req.casa.journeyContext.data).to.eql({
      employed: undefined,
      'employment-details': undefined,
      'employment-off-sick': undefined,
      'employment-last-work': undefined,
      'employment-status': undefined,
      'employment-hours': undefined,
      'employment-pay-frequency-samehours': undefined,
      'employment-support': undefined,
      'self-employment-details': undefined,
      'employment-expenses': undefined,
      'employment-expenses-details': undefined,
      'employment-pay-frequency-other': undefined,
    });
  });
});

describe('employmentDataUtils.updateSpecificEmployment', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext').resolves();
    });
    afterEach(() => {
        sandbox.restore();
    });
  it('should update a specific instance of paid work to the employment Gather and call relevant functions', () => {
    const req = {
      casa: {
        journeyContext: {
          data: {
            'employment-status': {
              workTypes: 'employed',
            },
            'employment-details': {
              jobTitle: 'new',
              employerAddress: {},
            },
          },
        },
      },
      session: {
        save: () => {},
        editIndex: '0',
        employmentGather: [{
          jobTitle: 'old',
        }],
      },
    };
    employmentDataUtils.updateSpecificEmployment(req.casa.journeyContext.data, req);
    expect(req.session.employmentGather[0].selfEmployed).to.equal(false);
    expect(req.session.employmentGather[0].jobTitle).to.equal('new');
  });
});

describe('employmentDataUtils.addEmploymentToGather', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext').resolves();
    });
    afterEach(() => {
        sandbox.restore();
    });
  it('should add an instance of paid work to the employment Gather and call relevant functions', () => {
    const req = {
      casa: {
        journeyContext: {
          setDataForPage: (p, d) => {
            req.casa.journeyContext.data[p] = undefined;
          },
          data: {
            'employment-status': {
              workTypes: 'employed',
            },
            'employment-details': {
              jobTitle: 'new',
              employerAddress: {},
            },
          },
        },
      },
      session: {
        save: () => {},
        employmentGather: [],
      },
    };
    employmentDataUtils.addEmploymentToGather(req.casa.journeyContext.data, req);
    expect(req.session.employmentGather[0].selfEmployed).to.equal(false);
    expect(req.session.employmentGather[0].jobTitle).to.equal('new');
  });
});

describe('employmentDataUtils.getEmployerName', () => {
  it('should return Employer name from employed page when status is not self-employed', () => {
    const req = {
      casa: {
        journeyContext: {
          data: {
            data: {
              'employment-details': { employerName: 'Employer' },
              'self-employment-details': { employerName: 'Self Employer' },
              'employment-status': { workTypes: ['employed'] },
            },
          },
        },
      },
    };
    assert.equal(employmentDataUtils.getEmployerName(req), 'Employer');
  });
  it('should return Self Employer name from self-employed page when status is self-employed', () => {
    const req = {
      casa: {
        journeyContext: {
          data: {
            data: {
              'employment-details': { employerName: 'Employer' },
              'self-employment-details': { employerName: 'Self Employer' },
              'employment-status': { workTypes: ['selfEmployed'] },
            },
          },
        },
      },
    };
    assert.equal(employmentDataUtils.getEmployerName(req), 'Self Employer');
  });
});
