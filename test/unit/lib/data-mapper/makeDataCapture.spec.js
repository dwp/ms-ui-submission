const { expect } = require('chai');
const makeDataCapture = require('../../../../app/lib/data-mapper/makeDataCapture.js');

describe('DataMapper', () => {
  let i18nTranslator = {
    t: () => this,
    getLanguage: () => 'en',
  };
  const session = {
    voluntaryGather: [{
      organisationAddress: {
        address1: 'test',
        address2: 'test',
        address3: 'test',
        postcode: 'test',
      },
      sameHours: 'yes',
      hours: '10',
      expenses: 'yes',
    }],
    employmentGather: [{
      employerAddress: {
        address1: 'test',
        address2: 'test',
        address3: 'test',
        postcode: 'test',
      },
      offSick: 'no',
      sameHours: 'yes',
      hours: '10',
      expenses: 'yes',
    }],
    pensionGather: [{
      pensionProvider: 'test',
      providerTel: 'test',
      providerRef: 'test',
      providerAddress: {
        address1: 'test',
        address2: 'test',
        address3: 'test',
        postcode: 'test',
      },
      pensionStartDate: {
        dd: '01',
        mm: '1',
        yyyy: '2020',
      },
      deductions: 'yes',
      amountBeforeDeductions: 'test',
      amountAfterDeductions: 'test',
      frequency: 'test',
      inherited: 'test',
    }],
    insuranceGather: [{
      insuranceProvider: 'test',
      providerTel: 'test',
      providerRef: 'test',
      providerAddress: {
        address1: 'test',
        address2: 'test',
        address3: 'test',
        postcode: 'test',
      },
      endDate: {
        dd: '01',
        mm: '1',
        yyyy: '2020',
      },
      amount: 'test',
      frequency: 'test',
      premiums: 'no',
      stillWork: 'no',
    }],
  };

  const journeyDataValues = {
    conditions: {
      conditions: [{
        name: 'test',
        conditionStartDate: {
          dd: '01',
          mm: '1',
          yyyy: '2020',
        },
      }],
    },
    address: {
      correspondence: 'no',
      correspondenceAddress: {
        address1: 'test',
        address2: 'test',
        address3: 'test',
        postcode: 'test',
      },
      address: {
        address1: 'test',
        address2: 'test',
        address3: 'test',
        postcode: 'test',
      },
    },
    'hospital-inpatient': {
      hospitalInpatient: 'yes',
      admissionDate: {
        dd: '01',
        mm: '01',
        yyyy: '0101',
      },
    },
    'hospital-planned': {
      hospitalPlanned: 'yes',
      admissionDate: {
        dd: '01',
        mm: '01',
        yyyy: '0101',
      },
    },
    'doctor-declaration': {
      docShareWithDWP: 'yes',
    },
    'consent-outcome': {
      dwpShareWithDoc: 'yes',
    },
    'work-overseas': {
      workOverseas: 'yes',
    },
    'military-overseas': {
      militaryOverseas: 'yes',
    },
    'statutory-sick-pay': {
      ssp: 'yes',
    },
    'statutory-sick-pay-end': {
      sspEndDate: {
        dd: '01',
        mm: '01',
        yyyy: '0101',
      },
    },
    'statutory-sick-pay-recent': {
      sspRecent: 'yes',
    },
    'statutory-sick-pay-recent-end': {
      sspRecentEndDate: {
        dd: '01',
        mm: '01',
        yyyy: '0101',
      },
    },
    'statutory-pay-other': {
      statutoryPayOther: 'none',
    },
    'voluntary-work': {
      screen: 'voluntary-work-other',
    },
    'claim-end-date': {
      claimEnd: 'yes',
      claimEndDate: '2020-11-2',
    },
    consent: {
      consent: 'yes',
    },
    employed: {
      screen: 'employed-other',
    },
    pension: {
      screen: 'pension-other',
    },
    insurance: {
      screen: 'insurance-other',
    },
    nino: {
      nino: 'AA370773A',
    },
    pregnant: {
      pregnant: 'yes',
      dueDate: {
        dd: '01',
        mm: '01',
        yyyy: '0101',
      },
    },
    'severe-condition': {
      severeCondition: 'yes',
    },
    'ds1500-report': {
      ds1500Report: 'yes',
    },
    'bank-details': {
      accountName: 'test',
      sortCode: {
        sortCode: '010101',
      },
      accountNumber: 'test',
      rollNumber: 'test',
    },
    'medical-centre': {
      name: 'test',
      tel: 'test',
      doctor: 'test',
      address: {
        address1: 'test',
        address2: 'test',
        address3: 'test',
        postcode: 'test',
      },
    },
    'claim-start-date': {
      claimStartDate: {
        dd: '01',
        mm: '1',
        yyyy: '2020',
      },
    },
    coronavirus: {
      coronavirusReasonForClaim: 'yes',
    },
    'universal-credit': {
      universalCredit: 'yes',
    },
    'coronavirus-reason-for-claim': {
      coronavirusReasonForClaim: 'high-risk',
    },
    'coronavirus-shielding': {
      coronavirusShielding: 'yes',
    },
    'coronavirus-date': {
      coronavirusDate: {
        dd: '01',
        mm: '01',
        yyyy: '2020',
      },
    },
    'coronavirus-other-condition': {
      coronavirusOtherCondition: 'yes',
    },
  };

  const journeyData = {
    getDataForPage: (page) => journeyDataValues[page],
  };

  it('should exist', () => {
    const mdc = makeDataCapture(i18nTranslator, journeyData, session);
    return expect(mdc).to.not.be.undefined;
  });

  it('should build a data object', () => {
    const mdc = makeDataCapture(i18nTranslator, journeyData, session);
    return expect(mdc).to.have.property('nino', 'AA370773A');
  });
  it('should build a data object with alternate options', () => {
    i18nTranslator = {
      t: () => this,
      getLanguage: () => 'cy',
    };
    const jd = { ...journeyData };
    jd.getDataForPage('statutory-sick-pay').ssp = 'no';
    jd.getDataForPage('pension').inherited = '';
    const s = { ...session };
    s.voluntaryGather[0].sameHours = 'no';
    s.employmentGather[0].offSick = 'yes';
    s.employmentGather[0].lastWorkedDate = {
      dd: '01',
      mm: '01',
      yyyy: '0101',
    };
    s.pensionGather[0].deductions = 'no';
    s.pensionGather[0].inherited = '';
    s.pensionGather[0].pensionStartDate = {
      dd: '',
      mm: '',
      yyyy: '',
    };
    s.insuranceGather[0].premiums = 'yes';
    const mdc = makeDataCapture(i18nTranslator, jd, s);
    expect(mdc).to.have.property('nino', 'AA370773A');
    expect(mdc.pensions[0]).to.have.property('start_date', '');
    expect(mdc.pensions[0]).to.have.property('inherited', '');
  });
  it('should build a data object with other alternate options', () => {
    const jd = { ...journeyData };
    jd.getDataForPage('statutory-sick-pay').ssp = 'no';
    jd.getDataForPage('pension').inherited = '';
    const s = { ...session };
    s.voluntaryGather[0].sameHours = 'no';
    s.employmentGather[0].offSick = 'no';
    s.employmentGather[0].sameHours = 'no';
    s.employmentGather[0].expenses = 'no';
    s.employmentGather[0].lastWorkedDate = {
      dd: '01',
      mm: '01',
      yyyy: '0101',
    };
    s.pensionGather[0].deductions = 'no';
    s.pensionGather[0].inherited = '';
    s.pensionGather[0].pensionStartDate = {
      dd: '',
      mm: '',
      yyyy: '',
    };
    s.insuranceGather[0].premiums = 'yes';
    const mdc = makeDataCapture(i18nTranslator, jd, s);
    expect(mdc).to.have.property('nino', 'AA370773A');
    expect(mdc.pensions[0]).to.have.property('start_date', '');
    expect(mdc.pensions[0]).to.have.property('inherited', '');
  });
});
