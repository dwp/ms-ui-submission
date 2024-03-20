import whoIsApplyingFields from './field-validators/who-is-applying.js';
import disabilityOrHealthConditionFields from './field-validators/disability-or-health-condition.js';
import notEligibleDisabilityOrHealthConditionFields from './field-validators/not-eligible-disability-or-health-condition.js';
import statePensionAgeFields from './field-validators/state-pension-age.js';
import nationalInsuranceFields from './field-validators/national-insurance.js';
import getNationalInsuranceCreditsFields from './field-validators/get-national-insurance-credits.js';
import statutoryPayFields from './field-validators/statutory-pay.js';
import statutoryPayNoReasonFields from './field-validators/reason-no-sick-pay.js';
import statutoryPayEndDateFields from './field-validators/statutory-pay-end-date.js';
import addressFields from './field-validators/address.js';
import correspondenceAddressFields from './field-validators/correspondence-address.js';
import langPrefWritingFields from './field-validators/language-preference-writing.js';
import langPrefSpeakingFields from './field-validators/language-preference-speaking.js';
import bankDetailsFields from './field-validators/bank-details.js';
import claimEndDateFields from './field-validators/claim-end-date.js';
import claimStartDateFields from './field-validators/claim-start-date.js';
import lateClaimFields from './field-validators/late-claim.js';
import conditionsFields from './field-validators/conditions.js';
import anotherHealthConditionFields from './field-validators/another-health-condition.js';
import consentOutcomeFields from './field-validators/consent-outcome.js';
import dateOfBirthFields from './field-validators/date-of-birth.js';
import doctorDeclarationFields from './field-validators/doctor-declaration.js';
import emailFields from './field-validators/email.js';
import employedFields from './field-validators/employed.js';
import selfEmploymentDetailsFields from './field-validators/self-employment-details.js';
import employmentDetailsFields from './field-validators/employment-details.js';
import employmentExpensesFields from './field-validators/employment-expenses.js';
import employmentExpensesDetailsFields from './field-validators/employment-expenses-details.js';
import employmentHoursFields from './field-validators/employment-hours.js';
import employmentLastWorkFields from './field-validators/employment-last-work.js';
import employmentOffSickFields from './field-validators/employment-off-sick.js';
import employmentPayFrequencySameHoursFields from './field-validators/employment-pay-frequency-samehours.js';
import employmentPayFrequencyOtherFields from './field-validators/employment-pay-frequency-other.js';
import employmentStatusFields from './field-validators/employment-status.js';
import employmentSupportFields from './field-validators/employment-support.js';
import hospitalInpatientFields from './field-validators/hospital-inpatient.js';
import hospitalDetailsFields from './field-validators/hospital-details.js';
import insuranceFields from './field-validators/insurance.js';
import medicalCentreFields from './field-validators/medical-centre.js';
import militaryOverseasFields from './field-validators/military-overseas.js';
import mobileFields from './field-validators/mobile.js';
import nameFields from './field-validators/name.js';
import ninoFields from './field-validators/national-insurance-number.js';
import otherNumberFields from './field-validators/other-number.js';
import pensionFields from './field-validators/pension.js';
import pensionInheritFields from './field-validators/pension-inherit.js';
import pregnantFields from './field-validators/pregnant.js';
import pregnantDueDateFields from './field-validators/pregnant-due-date.js';
import liveLessThanTwelveMonthsFields from './field-validators/live-less-than-12-months.js';
import statutoryPayOtherFields from './field-validators/statutory-pay-other.js';
import sspEndFields from './field-validators/statutory-sick-pay-end.js';
import sspRecentFields from './field-validators/statutory-sick-pay-recent.js';
import voluntaryWorkFields from './field-validators/voluntary-work.js';
import voluntaryWorkDetailsFields from './field-validators/voluntary-work-details.js';
import voluntaryWorkHoursFields from './field-validators/voluntary-work-hours.js';
import voluntaryWorkRoleFields from './field-validators/voluntary-work-role.js';
import workOverseasFields from './field-validators/work-overseas.js';
import universalCreditFields from './field-validators/universal-credit.js';
import claimStartDateAfterSspFields from './field-validators/claim-start-date-after-statutory-sick-pay.js';
import sr1ReportValidators from './field-validators/sr1-report.js';

import whoIsApplyingHooks from './page-hooks/who-is-applying.js';
import eligibilityHooks from './page-hooks/eligibility-start.js';
import getNationalInsuranceCreditsHooks from './page-hooks/get-national-insurance-credits.js';
import notEligibleSspHooks from './page-hooks/not-eligible-statutory-pay.js';
import addressHooks from './page-hooks/address.js';
import correspondenceAddressHooks from './page-hooks/correspondence-address.js';
import bankDetailsHooks from './page-hooks/bank-details.js';
import claimEndDateHooks from './page-hooks/claim-end-date.js';
import claimStartDateHooks from './page-hooks/claim-start-date.js';
import lateClaimHooks from './page-hooks/late-claim.js';
import conditionsHooks from './page-hooks/conditions.js';
import anotherHealthConditionHooks from './page-hooks/another-health-condition.js';
import dateOfBirthHooks from './page-hooks/date-of-birth.js';
import employedHooks from './page-hooks/employed.js';
import employmentDetailsHooks from './page-hooks/employment-details.js';
import selfEmploymentDetailsHooks from './page-hooks/self-employment-details.js';
import employmentExpensesHooks from './page-hooks/employment-expenses.js';
import employmentExpensesDetailHooks from './page-hooks/employment-expenses-details.js';
import employmentHoursHooks from './page-hooks/employment-hours.js';
import employmentLastWorkHooks from './page-hooks/employment-last-work.js';
import employmentOffSickHooks from './page-hooks/employment-off-sick.js';
import employmentPayFrequencySameHoursHooks from './page-hooks/employment-pay-frequency-samehours.js';
import employmentPayFrequencyOtherHooks from './page-hooks/employment-pay-frequency-other.js';
import employmentStatusHooks from './page-hooks/employment-status.js';
import employmentSupportHooks from './page-hooks/employment-support.js';
import employmentLastPagePostValidateHooks from './page-hooks/employment-last-page-post-validate.js';
import hospitalDetailsHooks from './page-hooks/hospital-details.js';
import insuranceHooks from './page-hooks/insurance.js';
import pensionHooks from './page-hooks/pension.js';
import pregnantDueDateHooks from './page-hooks/pregnant-due-date.js';
import pregnantHooks from './page-hooks/pregnant.js';
import voluntaryWorkHooks from './page-hooks/voluntary-work.js';
import voluntaryWorkDetailsHooks from './page-hooks/voluntary-work-details.js';
import voluntaryWorkHoursHooks from './page-hooks/voluntary-work-hours.js';
import voluntaryWorkRoleHooks from './page-hooks/voluntary-work-role.js';
import claimStartDateAfterSspHooks from './page-hooks/claim-start-date-after-statutory-sick-pay.js';
import submitHooks from './page-hooks/submit.js';
import sr1ReportHooks from './page-hooks/sr1-report.js';
import liveLessThan12MonthsHooks from './page-hooks/live-less-than-12-months-hooks.js';
import mobileHooks from './page-hooks/mobile.js';
import hospitalInpatientHooks from './page-hooks/hospital-inpatient.js';
import pensionInheritHooks from './page-hooks/pensionInheritHooks.js';
import languagePreferenceSpeaking from './page-hooks/language-preference-speaking.js';
import statutorySickPayEndHooks from './page-hooks/statutory-sick-pay-end.js';
import medicalCentreHooks from './page-hooks/medical-centre.js';
import doctorDeclarationHooks from './page-hooks/doctor-declaration.js';
import statutoryPayHooks from './page-hooks/statutory-sick-pay.js';
import statutoryPayNoReasonPostValidateHooks from './page-hooks/reason-no-sick-pay.js';
import statutoryPayNoRecenteHooks from './page-hooks/statutory-sick-pay-recent.js';

const {
  prerender: whoIsApplyingPrerender,
} = whoIsApplyingHooks();
const {
  prerender: eligibilityPrerender,
} = eligibilityHooks();
const {
  prerender: getNationalInsuranceCreditsPrerender,
  preredirect: getNationalInsuranceCreditsPreredirect,
} = getNationalInsuranceCreditsHooks();
const {
  prerender: notEligibleSspPrerender,
} = notEligibleSspHooks();
const {
  prerender: addressPrerender,
  prevalidate: addressPrevalidate,
  postvalidate: addressPostvalidate,
} = addressHooks();
const {
  prerender: correspondenceAddressPrerender,
  prevalidate: correspondenceAddressPrevalidate,
  preredirect: correspondenceAddressPreredirect,
} = correspondenceAddressHooks();
const {
  prerender: bankDetailsPrerender,
} = bankDetailsHooks();
const {
  prerender: claimEndDatePrerender,
} = claimEndDateHooks();
const {
  preredirect: claimEndDatePreRedirect,
} = claimEndDateHooks();
const {
  prerender: claimStartDatePrerender,
} = claimStartDateHooks();
const {
  preredirect: claimStartDatePreRedirect,
} = claimStartDateHooks();
const {
  prerender: lateClaimPrerender,
} = lateClaimHooks();
const {
  preredirect: lateClaimPreRedirect,
} = lateClaimHooks();
const {
  prerender: anotherHealthConditionPrerender,
  preredirect: anotherHealthConditionPreredirect,
} = anotherHealthConditionHooks();
const {
  prerender: dateOfBirthPrerender,
} = dateOfBirthHooks();
const {
  prerender: employedPrerender,
} = employedHooks();
const {
  preredirect: employedPreRedirect,
} = employedHooks();
const {
  prerender: employmentDetailsPrerender,
  prevalidate: employmentDetailsPrevalidate,
  preredirect: employmentDetailsPreRedirect,
} = employmentDetailsHooks();
const {
  prerender: selfEmploymentDetailsPrerender,
  prevalidate: selfEmploymentDetailsPrevalidate,
  preredirect: selfEmploymentDetailsPreRedirect,
} = selfEmploymentDetailsHooks();
const {
  prerender: employmentExpensesPrerender,
} = employmentExpensesHooks();
const {
  prerender: employmentExpensesDetailsPrerender,
} = employmentExpensesDetailHooks();
const {
  prerender: employmentHoursPrerender,
} = employmentHoursHooks();
const {
  prerender: employmentLastPrerender,
} = employmentLastWorkHooks();
const {
  prerender: employmentOffSickPrerender,
} = employmentOffSickHooks();
const {
  postvalidate: employmentOffSickPostValidate,
} = employmentOffSickHooks();
const {
  prerender: employmentPayFrequencySameHoursPrerender,
} = employmentPayFrequencySameHoursHooks();
const {
  prerender: employmentPayFrequencyOtherPrerender,
} = employmentPayFrequencyOtherHooks();
const {
  prerender: employmentStatusPrerender,
} = employmentStatusHooks();
const {
  postvalidate: employmentStatusPostValidate,
} = employmentStatusHooks();
const {
  prerender: employmentSupportPrerender,
} = employmentSupportHooks();
const {
  postvalidate: employmentExpensesPostValidate,
} = employmentExpensesHooks();
const {
  postvalidate: employmentLastPagePostValidate,
} = employmentLastPagePostValidateHooks();
const {
  prerender: insurancePrerender,
} = insuranceHooks();
const {
  prerender: pensionPrerender,
  postvalidate: pensionPostvalidate,
} = pensionHooks();
const {
  prerender: pregnantDueDatePrerender,
  preredirect: pregnantDueDatePreredirect,
} = pregnantDueDateHooks();
const {
  prerender: voluntaryWorkPrerender,
  preredirect: voluntaryWorkPreredirect,
} = voluntaryWorkHooks();
const {
  prerender: voluntaryWorkDetailsPrerender,
  prevalidate: voluntaryWorkDetailsPrevalidate,
} = voluntaryWorkDetailsHooks();
const {
  prerender: voluntaryWorkHoursPrerender,
  preredirect: voluntaryWorkRolePreredirect,
} = voluntaryWorkHoursHooks();
const {
  prerender: voluntaryWorkRolePrerender,
} = voluntaryWorkRoleHooks();
const {
  prerender: claimStartDateAfterSspPrerender,
} = claimStartDateAfterSspHooks();
const {
  postvalidate: claimStartDateAfterSspPostvalidate,
} = claimStartDateAfterSspHooks();
const {
  prerender: statutoryPayPreRender,
} = statutoryPayHooks();
const {
  postvalidate: statutoryPayPostValidate,
} = statutoryPayHooks();
const {
  postvalidate: statutoryPayNoReasonPostValidate,
} = statutoryPayNoReasonPostValidateHooks();
const {
  prerender: tatutoryPayNoRecentPrerender,
} = statutoryPayNoRecenteHooks();
const {
  preredirect: statutoryPayNoRecentPreRedirect,
} = statutoryPayNoRecenteHooks();
const {
  prerender: statutorySickPayEndPrerender,
} = statutorySickPayEndHooks();
const {
  preredirect: statutorySickPayEndPreRedirect,
} = statutorySickPayEndHooks();

export default () => [{
  waypoint: 'accessibility-statement',
  view: 'pages/accessibility-statement.njk',
}, {
  waypoint: 'who-is-applying',
  view: 'pages/who-is-applying.njk',
  fields: whoIsApplyingFields(),
  hooks: [{
    hook: 'prerender',
    middleware: whoIsApplyingPrerender,
  }],
},

{
  waypoint: 'cannot-apply-online',
  view: 'pages/cannot-apply-online.njk',
}, {
  waypoint: 'helping-someone-apply',
  view: 'pages/helping-someone-apply.njk',
},
{
  waypoint: 'eligibility-start',
  view: 'pages/eligibility-start.njk',
  hooks: [{
    hook: 'prerender',
    middleware: eligibilityPrerender,
  }],
}, {
  waypoint: 'disability-or-health-condition',
  view: 'pages/disability-or-health-condition.njk',
  fields: disabilityOrHealthConditionFields(),
}, {
  waypoint: 'not-eligible-disability-or-health-condition',
  view: 'pages/not-eligible-disability-or-health-condition.njk',
  fields: notEligibleDisabilityOrHealthConditionFields(),
}, {
  waypoint: 'state-pension-age',
  view: 'pages/state-pension-age.njk',
  fields: statePensionAgeFields(),
}, {
  waypoint: 'not-eligible-state-pension',
  view: 'pages/not-eligible-state-pension.njk',
}, {
  waypoint: 'national-insurance',
  view: 'pages/national-insurance.njk',
  fields: nationalInsuranceFields(),
},
{
  waypoint: 'get-national-insurance-credits',
  view: 'pages/get-national-insurance-credits.njk',
  fields: getNationalInsuranceCreditsFields(),
  hooks: [{
    hook: 'prerender',
    middleware: getNationalInsuranceCreditsPrerender,
  },
  {
    hook: 'preredirect',
    middleware: getNationalInsuranceCreditsPreredirect,
  }],
}, {
  waypoint: 'statutory-pay',
  view: 'pages/statutory-pay.njk',
  fields: statutoryPayFields(),
  hooks: [
    {
      hook: 'prerender',
      middleware: statutoryPayPreRender,
    },
    {
      hook: 'postvalidate',
      middleware: statutoryPayPostValidate,
    },
  ],
}, {
  waypoint: 'reason-no-sick-pay',
  view: 'pages/reason-no-sick-pay.njk',
  fields: statutoryPayNoReasonFields(),
  hooks: [
    {
      hook: 'postvalidate',
      middleware: statutoryPayNoReasonPostValidate,
    },
  ],
}, {
  waypoint: 'statutory-pay-end-date',
  view: 'pages/statutory-pay-end-date.njk',
  fields: statutoryPayEndDateFields(),
}, {
  waypoint: 'not-eligible-statutory-pay',
  view: 'pages/not-eligible-statutory-pay.njk',
  hooks: [{
    hook: 'prerender',
    middleware: notEligibleSspPrerender,
  }],
}, {
  waypoint: 'may-be-eligible',
  view: 'pages/may-be-eligible.njk',
},
// Main Flow
{
  waypoint: 'address',
  view: 'pages/address.njk',
  fields: addressFields(),
  hooks: [{
    hook: 'prerender',
    middleware: addressPrerender,
  }, {
    hook: 'postvalidate',
    middleware: addressPostvalidate,
  }, {
    hook: 'prevalidate',
    middleware: addressPrevalidate,
  }],
}, {
  waypoint: 'correspondence-address',
  view: 'pages/correspondence-address.njk',
  fields: correspondenceAddressFields(),
  hooks: [{
    hook: 'prerender',
    middleware: correspondenceAddressPrerender,
  }, {
    hook: 'prevalidate',
    middleware: correspondenceAddressPrevalidate,
  }, {
    hook: 'preredirect',
    middleware: correspondenceAddressPreredirect,
  }],
}, {
  waypoint: 'language-preference-writing',
  view: 'pages/language-preference-writing.njk',
  fields: langPrefWritingFields(),
}, {
  waypoint: 'language-preference-speaking',
  view: 'pages/language-preference-speaking.njk',
  fields: langPrefSpeakingFields(),
  hooks: languagePreferenceSpeaking(),
},
{
  waypoint: 'bank-details',
  view: 'pages/bank-details.njk',
  fields: bankDetailsFields(),
  hooks: [{
    hook: 'prerender',
    middleware: bankDetailsPrerender,
  }],
},
{
  waypoint: 'claim-end-date',
  view: 'pages/claim-end-date.njk',
  fields: claimEndDateFields(),
  hooks: [
    {
      hook: 'prerender',
      middleware: claimEndDatePrerender,
    },
    {
      hook: 'preredirect',
      middleware: claimEndDatePreRedirect,
    },
  ],
}, {
  waypoint: 'claim-start-date',
  view: 'pages/claim-start-date.njk',
  fields: claimStartDateFields(),
  hooks: [
    {
      hook: 'prerender',
      middleware: claimStartDatePrerender,
    },
    {
      hook: 'preredirect',
      middleware: claimStartDatePreRedirect,
    },
  ],
}, {
  waypoint: 'late-claim',
  view: 'pages/late-claim.njk',
  fields: lateClaimFields(),
  hooks: [
    {
      hook: 'prerender',
      middleware: lateClaimPrerender,
    },
    {
      hook: 'preredirect',
      middleware: lateClaimPreRedirect,
    },
  ],
}, {
  waypoint: 'conditions',
  view: 'pages/conditions.njk',
  fields: conditionsFields(),
  hooks: conditionsHooks(),
}, {
  waypoint: 'another-health-condition',
  view: 'pages/another-health-condition.njk',
  fields: anotherHealthConditionFields(),
  hooks: [{
    hook: 'prerender',
    middleware: anotherHealthConditionPrerender,
  }, {
    hook: 'preredirect',
    middleware: anotherHealthConditionPreredirect,
  }],
}, {
  waypoint: 'consent-outcome',
  view: 'pages/consent-outcome.njk',
  fields: consentOutcomeFields(),
}, {
  waypoint: 'date-of-birth',
  view: 'pages/date-of-birth.njk',
  fields: dateOfBirthFields(),
  hooks: [{
    hook: 'prerender',
    middleware: dateOfBirthPrerender,
  }],
}, {
  waypoint: 'doctor-declaration',
  view: 'pages/doctor-declaration.njk',
  fields: doctorDeclarationFields(),
  hooks: doctorDeclarationHooks(),
}, {
  waypoint: 'sr1-report',
  view: 'pages/sr1-report.njk',
  fields: sr1ReportValidators(),
  hooks: sr1ReportHooks(),
}, {
  waypoint: 'email',
  view: 'pages/email.njk',
  fields: emailFields(),
}, {
  waypoint: 'employed',
  view: 'pages/employed.njk',
  fields: employedFields(),
  hooks: [
    {
      hook: 'prerender',
      middleware: employedPrerender,
    }, {
      hook: 'preredirect',
      middleware: employedPreRedirect,
    },
  ],
}, {
  waypoint: 'self-employment-details',
  view: 'pages/self-employment-details.njk',
  fields: selfEmploymentDetailsFields(),
  hooks: [
    {
      hook: 'prerender',
      middleware: selfEmploymentDetailsPrerender,
    },
    {
      hook: 'prevalidate',
      middleware: selfEmploymentDetailsPrevalidate,
    },
    {
      hook: 'preredirect',
      middleware: selfEmploymentDetailsPreRedirect,
    },
  ],
}, {
  waypoint: 'employment-details',
  view: 'pages/employment-details.njk',
  fields: employmentDetailsFields(),
  hooks: [
    {
      hook: 'prerender',
      middleware: employmentDetailsPrerender,
    },
    {
      hook: 'prevalidate',
      middleware: employmentDetailsPrevalidate,
    },
    {
      hook: 'preredirect',
      middleware: employmentDetailsPreRedirect,
    },
  ],
}, {
  waypoint: 'employment-expenses',
  view: 'pages/employment-expenses.njk',
  fields: employmentExpensesFields(),
  hooks: [
    {
      hook: 'prerender',
      middleware: employmentExpensesPrerender,
    },
    {
      hook: 'postvalidate',
      middleware: employmentExpensesPostValidate,
    },
  ],
}, {
  waypoint: 'employment-expenses-details',
  view: 'pages/employment-expenses-details.njk',
  fields: employmentExpensesDetailsFields(),
  hooks: [
    {
      hook: 'prerender',
      middleware: employmentExpensesDetailsPrerender,
    },
    {
      hook: 'postvalidate',
      middleware: employmentLastPagePostValidate,
    },
  ],
}, {
  waypoint: 'employment-hours',
  view: 'pages/employment-hours.njk',
  fields: employmentHoursFields(),
  hooks: [{
    hook: 'prerender',
    middleware: employmentHoursPrerender,
  }],
}, {
  waypoint: 'employment-last-work',
  view: 'pages/employment-last-work.njk',
  fields: employmentLastWorkFields(),
  hooks: [
    {
      hook: 'prerender',
      middleware: employmentLastPrerender,
    },
    {
      hook: 'postvalidate',
      middleware: employmentLastPagePostValidate,
    },
  ],
}, {
  waypoint: 'employment-off-sick',
  view: 'pages/employment-off-sick.njk',
  fields: employmentOffSickFields(),
  hooks: [
    {
      hook: 'prerender',
      middleware: employmentOffSickPrerender,
    },
    {
      hook: 'postvalidate',
      middleware: employmentOffSickPostValidate,
    },
  ],
}, {
  waypoint: 'employment-pay-frequency-samehours',
  view: 'pages/employment-pay-frequency-samehours.njk',
  fields: employmentPayFrequencySameHoursFields(),
  hooks: [{
    hook: 'prerender',
    middleware: employmentPayFrequencySameHoursPrerender,
  }],
}, {
  waypoint: 'employment-pay-frequency-other',
  view: 'pages/employment-pay-frequency-other.njk',
  fields: employmentPayFrequencyOtherFields(),
  hooks: [{
    hook: 'prerender',
    middleware: employmentPayFrequencyOtherPrerender,
  }],
}, {
  waypoint: 'employment-status',
  view: 'pages/employment-status.njk',
  fields: employmentStatusFields(),
  hooks: [
    {
      hook: 'prerender',
      middleware: employmentStatusPrerender,
    },
    {
      hook: 'postvalidate',
      middleware: employmentStatusPostValidate,
    },
  ],
}, {
  waypoint: 'employment-support',
  view: 'pages/employment-support.njk',
  fields: employmentSupportFields(),
  hooks: [{
    hook: 'prerender',
    middleware: employmentSupportPrerender,
  }],
}, {
  waypoint: 'hospital-inpatient',
  view: 'pages/hospital-inpatient.njk',
  fields: hospitalInpatientFields(),
  hooks: hospitalInpatientHooks(),
}, {
  waypoint: 'hospital-details',
  view: 'pages/hospital-details.njk',
  fields: hospitalDetailsFields(),
  hooks: hospitalDetailsHooks(),
}, {
  waypoint: 'insurance',
  view: 'pages/insurance.njk',
  fields: insuranceFields(),
  hooks: [{
    hook: 'prerender',
    middleware: insurancePrerender,
  }],
}, {
  waypoint: 'medical-centre',
  view: 'pages/medical-centre.njk',
  fields: medicalCentreFields(),
  hooks: medicalCentreHooks(),
}, {
  waypoint: 'military-overseas',
  view: 'pages/military-overseas.njk',
  fields: militaryOverseasFields(),
}, {
  waypoint: 'mobile',
  view: 'pages/mobile.njk',
  fields: mobileFields(),
  hooks: mobileHooks(),
}, {
  waypoint: 'name',
  view: 'pages/name.njk',
  fields: nameFields(),
}, {
  waypoint: 'national-insurance-number',
  view: 'pages/national-insurance-number.njk',
  fields: ninoFields(),
}, {
  waypoint: 'other-number',
  view: 'pages/other-number.njk',
  fields: otherNumberFields(),
}, {
  waypoint: 'pension',
  view: 'pages/pension.njk',
  fields: pensionFields(),
  hooks: [{
    hook: 'prerender',
    middleware: pensionPrerender,
  }, {
    hook: 'postvalidate',
    middleware: pensionPostvalidate,
  }],
}, {
  waypoint: 'pension-inherit',
  view: 'pages/pension-inherit.njk',
  fields: pensionInheritFields(),
  hooks: pensionInheritHooks(),
}, {
  waypoint: 'pregnant',
  view: 'pages/pregnant.njk',
  fields: pregnantFields(),
  hooks: pregnantHooks(),
}, {
  waypoint: 'pregnant-due-date',
  view: 'pages/pregnant-due-date.njk',
  fields: pregnantDueDateFields(),
  hooks: [{
    hook: 'prerender',
    middleware: pregnantDueDatePrerender,
  }, {
    hook: 'preredirect',
    middleware: pregnantDueDatePreredirect,
  }],
}, {
  waypoint: 'live-less-than-12-months',
  view: 'pages/live-less-than-12-months.njk',
  fields: liveLessThanTwelveMonthsFields(),
  hooks: liveLessThan12MonthsHooks(),
}, {
  waypoint: 'statutory-pay-other',
  view: 'pages/statutory-pay-other.njk',
  fields: statutoryPayOtherFields(),
}, {
  waypoint: 'statutory-sick-pay-end',
  view: 'pages/statutory-sick-pay-end.njk',
  fields: sspEndFields(),
  hooks: [
    {
      hook: 'prerender',
      middleware: statutorySickPayEndPrerender,
    },
    {
      hook: 'preredirect',
      middleware: statutorySickPayEndPreRedirect,
    },
  ],
}, {
  waypoint: 'statutory-sick-pay-recent',
  view: 'pages/statutory-sick-pay-recent.njk',
  fields: sspRecentFields(),
  hooks: [
    {
      hook: 'prerender',
      middleware: tatutoryPayNoRecentPrerender,
    },
    {
      hook: 'preredirect',
      middleware: statutoryPayNoRecentPreRedirect,
    },
  ],
}, {
  waypoint: 'voluntary-work',
  view: 'pages/voluntary-work.njk',
  fields: voluntaryWorkFields(),
  hooks: [{
    hook: 'prerender',
    middleware: voluntaryWorkPrerender,
  }, {
    hook: 'preredirect',
    middleware: voluntaryWorkPreredirect,
  }],
}, {
  waypoint: 'voluntary-work-details',
  view: 'pages/voluntary-work-details.njk',
  fields: voluntaryWorkDetailsFields(),
  hooks: [{
    hook: 'prerender',
    middleware: voluntaryWorkDetailsPrerender,
  }, {
    hook: 'prevalidate',
    middleware: voluntaryWorkDetailsPrevalidate,
  }],
}, {
  waypoint: 'voluntary-work-hours',
  view: 'pages/voluntary-work-hours.njk',
  fields: voluntaryWorkHoursFields(),
  hooks: [{
    hook: 'prerender',
    middleware: voluntaryWorkHoursPrerender,
  }, {
    hook: 'preredirect',
    middleware: voluntaryWorkRolePreredirect,
  }],
}, {
  waypoint: 'voluntary-work-role',
  view: 'pages/voluntary-work-role.njk',
  fields: voluntaryWorkRoleFields(),
  hooks: [{
    hook: 'prerender',
    middleware: voluntaryWorkRolePrerender,
  }],
}, {
  waypoint: 'work-overseas',
  view: 'pages/work-overseas.njk',
  fields: workOverseasFields(),
}, {
  waypoint: 'universal-credit',
  view: 'pages/universal-credit.njk',
  fields: universalCreditFields(),
}, {
  waypoint: 'claim-start-date-after-statutory-sick-pay',
  view: 'pages/claim-start-date-after-statutory-sick-pay.njk',
  fields: claimStartDateAfterSspFields(),
  hooks: [
    {
      hook: 'prerender',
      middleware: claimStartDateAfterSspPrerender,
    },
    {
      hook: 'postvalidate',
      middleware: claimStartDateAfterSspPostvalidate,
    },
  ],
}, {
  waypoint: 'check-your-answers',
  view: 'pages/check-your-answers.njk',
}, {
  waypoint: 'declaration',
  view: 'pages/declaration.njk',
},
{
  waypoint: 'complete',
  view: 'pages/complete.njk',
  hooks: submitHooks(),
}];
