/* eslint max-len: 0 */
const Logger = require('../Logger');
const formatDigit = require('../../utils/formatDigit');
const makeConditions = require('./makeConditions');
const makeMedicalCentre = require('./makeMedicalCentre');
const makeEmployments = require('./makeEmployments');
const makeInsurance = require('./makeInsurance');
const makePensions = require('./makePensions');
const makeVoluntary = require('./makeVoluntary');

const appLogger = Logger();

/**
 * Build the Conditions part of the data structure.
 *
 * @param {object} translator
 * @param {object} journeyData containing page data
 * @param {object} session data
 * @return {array} array
 */

module.exports = (translator, journeyData, session) => {
  const address = journeyData.getDataForPage('address');
  const bankDetails = journeyData.getDataForPage('bank-details');
  const claimStartDate = journeyData.getDataForPage('claim-start-date');
  const claimEndDate = journeyData.getDataForPage('claim-end-date');
  const consentOutcome = journeyData.getDataForPage('consent-outcome');
  const doctorDeclaration = journeyData.getDataForPage('doctor-declaration');
  const ds1500Report = journeyData.getDataForPage('ds1500-report');
  const employed = journeyData.getDataForPage('employed');
  const hospitalInpatient = journeyData.getDataForPage('hospital-inpatient');
  const insurance = journeyData.getDataForPage('insurance');
  const medicalCentre = journeyData.getDataForPage('medical-centre');
  const militaryOverseas = journeyData.getDataForPage('military-overseas');
  const mobile = journeyData.getDataForPage('mobile');
  const nino = journeyData.getDataForPage('nino');
  const otherNumber = journeyData.getDataForPage('other-number');
  const pension = journeyData.getDataForPage('pension');
  const pregnant = journeyData.getDataForPage('pregnant');
  const severeCondition = journeyData.getDataForPage('severe-condition');
  const ssp = journeyData.getDataForPage('statutory-pay');
  const sspEnd = journeyData.getDataForPage('statutory-sick-pay-end');
  const sspRecent = journeyData.getDataForPage('statutory-sick-pay-recent');
  const sspRecentEnd = journeyData.getDataForPage('statutory-sick-pay-recent-end');
  const statutoryPayOther = journeyData.getDataForPage('statutory-pay-other');
  const universalCredit = journeyData.getDataForPage('universal-credit');
  const voluntaryWork = journeyData.getDataForPage('voluntary-work');
  const workOverseas = journeyData.getDataForPage('work-overseas');
  const coronavirus = journeyData.getDataForPage('coronavirus');

  const {
    voluntaryGather, employmentGather, pensionGather, insuranceGather,
  } = session;

  const capture = {
    language: translator.getLanguage() === 'cy' ? 'cy' : 'en',
  };

  if (coronavirus.coronavirusReasonForClaim === 'yes') {
    const
      {
        coronavirusReasonForClaim,
        otherReasonDetail,
        highRiskDesc,
        selfIsolationSymptomsDesc,
        selfIsolationContactDesc,
      } = journeyData.getDataForPage('coronavirus-reason-for-claim');
    appLogger.info('DataMapper: collecting coronavirus data');
    capture.coronavirus_reason = coronavirusReasonForClaim;
    const coronavirusShielding = journeyData.getDataForPage('coronavirus-shielding');
    switch (coronavirusReasonForClaim) {
    case 'high-risk':
      capture.coronavirus_reason_desc = highRiskDesc;
      capture.coronavirus_shielding = coronavirusShielding.coronavirusShielding;
      break;
    case 'self-isolation-symptoms':
      capture.coronavirus_reason_desc = selfIsolationSymptomsDesc;
      break;
    case 'self-isolation-contact':
      capture.coronavirus_reason_desc = selfIsolationContactDesc;
      break;
    case 'other':
      capture.coronavirus_reason_desc = otherReasonDetail;
      break;
    default:
      capture.coronavirus_reason_desc = 'none';
      break;
    }
    const coronavirusOtherCondition = journeyData.getDataForPage('coronavirus-other-condition');
    if (typeof coronavirusOtherCondition !== 'undefined') {
      capture.other_health_condition = coronavirusOtherCondition.coronavirusOtherCondition;
      if (coronavirusOtherCondition.coronavirusOtherCondition === 'yes') {
        appLogger.info('DataMapper: collecting other health conditions data');
        capture.conditions = makeConditions(journeyData);
      }
    } else {
      appLogger.info('DataMapper: collecting health conditions data');
      capture.conditions = makeConditions(journeyData);
    }
    const { coronavirusDate } = journeyData.getDataForPage('coronavirus-date');
    capture.coronavirus_date = `${coronavirusDate.yyyy}-${formatDigit(coronavirusDate.mm)}-${formatDigit(coronavirusDate.dd)}`;
  } else {
    appLogger.info('DataMapper: collecting health conditions data');
    capture.conditions = makeConditions(journeyData);
  }

  capture.medical_centre = makeMedicalCentre(medicalCentre);
  capture.statutory_pay_other = statutoryPayOther.statutoryPayOther;
  capture.nino = nino.nino.replace(/\s/g, '').toUpperCase();
  capture.bank_account_name = bankDetails.accountName;
  capture.bank_name = bankDetails.bankName;
  capture.bank_sort_code = bankDetails.sortCode;
  capture.bank_account_number = bankDetails.accountNumber.replace(/\s/g, '');
  capture.claim_start_date = `${claimStartDate.claimStartDate.yyyy}-${formatDigit(claimStartDate.claimStartDate.mm)}-${formatDigit(claimStartDate.claimStartDate.dd)}`;

  appLogger.info('DataMapper: collecting alternative address data from journey, if needed');
  if (address.correspondence === 'no') {
    capture.correspondence_address = {
      lines: [
        address.correspondenceAddress.address1,
        address.correspondenceAddress.address2,
        address.correspondenceAddress.address3,
      ],
      premises: '',
      postcode: address.correspondenceAddress.postcode,
    };
  } else {
    capture.correspondence_address = null;
  }
  capture.claim_end = claimEndDate.claimEnd;
  if (claimEndDate.claimEnd === 'yes') {
    capture.claim_end_date = `${claimEndDate.claimEndDate.yyyy}-${formatDigit(claimEndDate.claimEndDate.mm)}-${formatDigit(claimEndDate.claimEndDate.dd)}`;
  }
  if (bankDetails.rollNumber) {
    capture.bank_roll_number = bankDetails.rollNumber;
  }
  capture.doc_share_with_dwp = doctorDeclaration.docShareWithDWP;
  capture.dwp_share_with_doc = consentOutcome.dwpShareWithDoc;
  capture.hospital_inpatient = hospitalInpatient.hospitalInpatient;
  if (hospitalInpatient.hospitalInpatient === 'yes') {
    capture.hospital_name = hospitalInpatient.hospitalName;
    capture.hospital_ward = hospitalInpatient.hospitalWard;
    capture.hospital_admission_date = `${hospitalInpatient.admissionDate.yyyy}-${formatDigit(hospitalInpatient.admissionDate.mm)}-${formatDigit(hospitalInpatient.admissionDate.dd)}`;
  }
  capture.military_overseas = militaryOverseas.militaryOverseas;
  capture.mobile = mobile && mobile.mobile;
  capture.other_number = otherNumber && otherNumber.other;
  capture.pregnant = pregnant.pregnant;
  if (pregnant.pregnant === 'yes') {
    capture.due_date = `${pregnant.dueDate.yyyy}-${formatDigit(pregnant.dueDate.mm)}-${formatDigit(pregnant.dueDate.dd)}`;
  }
  capture.severe_condition = severeCondition.severeCondition;
  if (severeCondition.severeCondition === 'yes') {
    capture.ds1500_report = ds1500Report.ds1500Report;
  }
  capture.ssp = ssp && ssp.statutoryPay;
  if (ssp && ssp.statutoryPay === 'yes') {
    capture.ssp_end = `${sspEnd.sspEndDate.yyyy}-${formatDigit(sspEnd.sspEndDate.mm)}-${formatDigit(sspEnd.sspEndDate.dd)}`;
  }
  capture.ssp_recent = sspRecent && sspRecent.sspRecent;
  if (sspRecent && sspRecent.sspRecent === 'yes') {
    capture.ssp_recent_end = `${sspRecentEnd.sspRecentEndDate.yyyy}-${formatDigit(sspRecentEnd.sspRecentEndDate.mm)}-${formatDigit(sspRecentEnd.sspRecentEndDate.dd)}`;
  }
  capture.universal_credit = universalCredit.universalCredit;
  capture.work_overseas = workOverseas.workOverseas;
  //
  // Set up capture data for the gather loops
  //
  appLogger.info('DataMapper: collecting paid work data from journey');
  if (employed.screen === 'employed-other') {
    capture.employment_question = 'yes';
    capture.employments = makeEmployments(employmentGather);
  } else {
    capture.employment_question = 'no';
  }
  appLogger.info('DataMapper: collecting voluntary work data from journey');
  if (voluntaryWork.screen === 'voluntary-work-other') {
    capture.voluntary_work_question = 'yes';
    capture.voluntary_work = makeVoluntary(voluntaryGather);
  } else {
    capture.voluntary_work_question = 'no';
  }
  appLogger.info('DataMapper: collecting pension data from journey');
  // If the answer to the pension question is anything other than 'yes', the DataUtils for
  // pensions will set the pensions page data to have only two properties - 'screen' and 'other'
  // Functions elsewhere assume that if there is no 'pension' data item it is because
  // the answer was 'yes'. If the answer was 'no' or 'notsure' the pension data item will
  // still exist for the pension page, so it can be used to set the value of the pension_question
  if (pension.screen === 'pension-other') {
    capture.pension_question = 'yes';
    capture.pensions = makePensions(pensionGather);
  } else {
    capture.pension_question = pension.pension;
  }
  appLogger.info('DataMapper: collecting health insurance data from journey');
  if (insurance.screen === 'insurance-other') {
    capture.insurance_question = 'yes';
    capture.insurance = makeInsurance(insuranceGather);
  } else {
    capture.insurance_question = insurance.insurance;
  }
  return capture;
};
