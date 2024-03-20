import { DateTime } from 'luxon';
import Logger from '../logger.js';
import formatDigit from '../../../app/utils/formatDigit.js';
import makeConditions from './makeConditions.js';
import makeMedicalCentre from './makeMedicalCentre.js';
import makeEmployments from './makeEmployments.js';
import makeInsurance from './makeInsurance.js';
import makePensions from './makePensions.js';
import makeVoluntary from './makeVoluntary.js';

const appLogger = Logger();

/**
 * Build the Conditions part of the data structure.
 *
 * @param {object} translator
 * @param {object} journeyContext Containing page Data.
 * @param {object} session Data.
 * @returns {Array} Array.
 */

export default (journeyContext, session) => {
  const { address } = journeyContext;
  const correspondenceAddress = journeyContext['correspondence-address'];
  const bankDetails = journeyContext['bank-details'];
  const claimStartDate = journeyContext['claim-start-date'];
  const claimEndDate = journeyContext['claim-end-date'];
  const consentOutcome = journeyContext['consent-outcome'];
  const doctorDeclaration = journeyContext['doctor-declaration'];
  const sr1Report = journeyContext['sr1-report'];
  const { employed } = journeyContext;
  const hospitalInpatient = journeyContext['hospital-inpatient'];
  const hospitalDetails = journeyContext['hospital-details'];
  const { insurance } = journeyContext;
  const medicalCentre = journeyContext['medical-centre'];
  const militaryOverseas = journeyContext['military-overseas'];
  const { mobile } = journeyContext;
  const nino = journeyContext['national-insurance-number'];
  const otherNumber = journeyContext['other-number'];
  const { pension } = journeyContext;
  const pensionInherit = journeyContext['pension-inherit'];
  const { pregnant } = journeyContext;
  const pregnantDueDate = journeyContext['pregnant-due-date'];
  const severeCondition = journeyContext['live-less-than-12-months'];
  const ssp = journeyContext['statutory-pay'];
  const sspEnd = journeyContext['statutory-sick-pay-end'];
  const sspRecent = journeyContext['statutory-sick-pay-recent'];
  const statutoryPayOther = journeyContext['statutory-pay-other'];
  const statutoryPayNoReason = journeyContext['reason-no-sick-pay'];
  const universalCredit = journeyContext['universal-credit'];
  const voluntaryWork = journeyContext['voluntary-work'];
  const workOverseas = journeyContext['work-overseas'];
  const claimStartDateAfterSsp = journeyContext['claim-start-date-after-statutory-sick-pay'];
  const { postcode } = journeyContext;
  const langPrefWriting = journeyContext['language-preference-writing'];
  const langPrefSpeaking = journeyContext['language-preference-speaking'];
  const emailJourneyData = journeyContext.email;

  const {
    voluntaryGather, employmentGather, pensionGather, insuranceGather, conditionGather,
  } = session;

  const capture = {
    language: session.language === 'cy' ? 'cy' : 'en',
  };

  appLogger.info('DataMapper: collecting health conditions data');
  capture.conditions = makeConditions(conditionGather);

  capture.medical_centre = makeMedicalCentre(medicalCentre);
  capture.statutory_pay_other = statutoryPayOther.statutoryPayOther;
  capture.nino = nino.nino.replace(/\s/g, '').toUpperCase();
  capture.bank_account_name = bankDetails.accountName;
  capture.bank_name = bankDetails.bankName;
  capture.bank_sort_code = bankDetails.sortCode.replace(/\s/g, '');
  capture.bank_account_number = bankDetails.accountNumber.replace(/\s/g, '');

  appLogger.info('DataMapper: collecting alternative address data from journey, if needed');
  if (address.correspondence === 'no') {
    capture.correspondence_address = {
      lines: [
        correspondenceAddress.correspondenceAddress.address1,
        correspondenceAddress.correspondenceAddress.address2,
        correspondenceAddress.correspondenceAddress.address3,
      ],
      premises: '',
      postcode: correspondenceAddress.correspondenceAddress.postcode,
    };
  } else {
    capture.correspondence_address = null;
  }
  if (postcode.welsh) {
    capture.welsh_postcode = 'yes';
    capture.lang_pref_writing = langPrefWriting.langPrefWriting;
    capture.lang_pref_speaking = langPrefSpeaking.langPrefSpeaking;
  } else {
    capture.welsh_postcode = 'no';
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
    capture.hospital_name = hospitalDetails.hospitalName;
    capture.hospital_ward = hospitalDetails.hospitalWard;
    capture.hospital_admission_date = `${hospitalDetails.admissionDate.yyyy}-${formatDigit(hospitalDetails.admissionDate.mm)}-${formatDigit(hospitalDetails.admissionDate.dd)}`;
  }
  capture.military_overseas = militaryOverseas.militaryOverseas;
  capture.mobile = mobile && mobile.mobile;
  capture.other_number = otherNumber && otherNumber.other && otherNumber.other.replace(/\s/g, '');
  capture.pregnant = pregnant.pregnant;
  if (pregnant.pregnant === 'yes') {
    capture.due_date = `${pregnantDueDate.dueDate.yyyy}-${formatDigit(pregnantDueDate.dueDate.mm)}-${formatDigit(pregnantDueDate.dueDate.dd)}`;
  }
  capture.severe_condition = severeCondition.severeCondition;
  if (severeCondition.severeCondition === 'yes') {
    capture.ds1500_report = sr1Report.sr1Report;
  }
  capture.ssp = ssp && ssp.statutoryPay;
  if (ssp && ssp.statutoryPay === 'yes') {
    capture.ssp_end = `${sspEnd.sspEndDate.yyyy}-${formatDigit(sspEnd.sspEndDate.mm)}-${formatDigit(sspEnd.sspEndDate.dd)}`;
  }
  if (ssp && ssp.statutoryPay === 'no') {
    capture.statutory_pay_no_reason = statutoryPayNoReason.statutoryPayNoReason;
  }
  capture.ssp_recent = sspRecent && sspRecent.sspRecent;
  if ((ssp && ssp.statutoryPay === 'yes') || (sspRecent && sspRecent.sspRecent === 'yes')) {
    capture.ssp_recent_end = `${sspEnd.sspEndDate.yyyy}-${formatDigit(sspEnd.sspEndDate.mm)}-${formatDigit(sspEnd.sspEndDate.dd)}`;
    const day = parseInt(sspEnd.sspEndDate.dd, 10);
    const month = parseInt(sspEnd.sspEndDate.mm, 10);
    const year = parseInt(sspEnd.sspEndDate.yyyy, 10);
    capture.day_after_ssp_recent_end = DateTime.fromFormat(`${day} ${month} ${year}`, 'd M yyyy').plus({ days: 1 }).toFormat('yyyy-MM-dd');
    capture.claim_start_date_after_ssp = claimStartDateAfterSsp.claimStartDateAfterSsp;
  }
  if (typeof claimStartDate !== 'undefined' && typeof claimStartDate.claimStartDate !== 'undefined') {
    capture.claim_start_date = `${claimStartDate.claimStartDate.yyyy}-${formatDigit(claimStartDate.claimStartDate.mm)}-${formatDigit(claimStartDate.claimStartDate.dd)}`;
  } else {
    capture.claim_start_date = capture.day_after_ssp_recent_end;
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
  if (pension.pension === 'yes') {
    capture.pension_inherit = pensionInherit.pensionInherit;
  }
  appLogger.info('DataMapper: collecting health insurance data from journey');
  if (insurance.screen === 'insurance-other') {
    capture.insurance_question = 'yes';
    capture.insurance = makeInsurance(insuranceGather);
  } else {
    capture.insurance_question = insurance.insurance;
  }

  if (emailJourneyData.emailProvided === 'yes') {
    capture.email = emailJourneyData.email;
  }
  if (capture.conditions && capture.conditions.length === 0) {
    capture.conditions = undefined;
  }
  return capture;
};
