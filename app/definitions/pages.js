const moment = require('moment');
const { trimWhiteSpace } = require('@dwp/govuk-casa/lib/GatherModifier');
const { getEmployerName } = require('../lib/data-utils/employmentDataUtils');
const whoIsApplyingValidator = require('./field-validators/who-is-applying.js');
const addressValidators = require('./field-validators/address.js');
const correspondenceAddressValidators = require('./field-validators/correspondence-address.js');
const langPrefWritingValidators = require('./field-validators/language-preference-writing.js');
const langPrefSpeakingValidators = require('./field-validators/language-preference-speaking.js');
const lateClaimValidators = require('./field-validators/late-claim.js');
const bankDetailsValidators = require('./field-validators/bank-details.js');
const claimEndDateValidators = require('./field-validators/claim-end-date.js');
const claimStartDateValidators = require('./field-validators/claim-start-date.js');
const conditionsValidators = require('./field-validators/conditions');
const anotherHealthConditionValidators = require('./field-validators/another-health-condition');
const dateOfBirthValidators = require('./field-validators/date-of-birth.js');
const doctorDeclarationValidators = require('./field-validators/doctor-declaration.js');
const consentOutcomeValidators = require('./field-validators/consent-outcome.js');
const ds1500ReportValidators = require('./field-validators/ds1500-report.js');
const emailValidator = require('./field-validators/email');
const employedValidators = require('./field-validators/employed.js');
const employmentDetailsValidators = require('./field-validators/employment-details.js');
const selfEmploymentDetailsValidators = require('./field-validators/self-employment-details.js');
const employmentExpensesValidators = require('./field-validators/employment-expenses.js');
const employmentExpensesDetailsValidators = require('./field-validators/employment-expenses-details.js');
const employmentHoursValidators = require('./field-validators/employment-hours.js');
const employmentLastWorkValidators = require('./field-validators/employment-last-work.js');
const employmentOffSickValidators = require('./field-validators/employment-off-sick.js');
const employmentPayFrequencySameHoursValidators = require('./field-validators/employment-pay-frequency-samehours.js');
const employmentPayFrequencyOtherValidators = require('./field-validators/employment-pay-frequency-other.js');
const employmentStatusValidators = require('./field-validators/employment-status.js');
const employmentSupportValidators = require('./field-validators/employment-support.js');
const hospitalInpatientValidators = require('./field-validators/hospital-inpatient.js');
const hospitalDetailsValidators = require('./field-validators/hospital-details.js');
const insuranceValidators = require('./field-validators/insurance.js');
const medicalCentreValidators = require('./field-validators/medical-centre.js');
const militaryOverseasValidators = require('./field-validators/military-overseas.js');
const mobileValidators = require('./field-validators/mobile.js');
const nameValidators = require('./field-validators/name.js');
const ninoValidators = require('./field-validators/national-insurance-number.js');
const otherNumberValidators = require('./field-validators/other-number.js');
const pensionValidators = require('./field-validators/pension.js');
const pensionInheritValidators = require('./field-validators/pension-inherit.js');
const pregnantValidators = require('./field-validators/pregnant.js');
const pregnantDueDateValidators = require('./field-validators/pregnant-due-date.js');
const liveLessThanTwelveMonthsValidators = require('./field-validators/live-less-than-12-months.js');
const sspEndValidators = require('./field-validators/ssp-end.js');
const sspRecentValidators = require('./field-validators/ssp-recent.js');
const statutoryPayOtherValidators = require('./field-validators/statutory-pay-other.js');
const voluntaryWorkValidators = require('./field-validators/voluntary-work.js');
const voluntaryWorkDetailsValidators = require('./field-validators/voluntary-work-details.js');
const voluntaryWorkHoursValidators = require('./field-validators/voluntary-work-hours.js');
const voluntaryWorkRoleValidators = require('./field-validators/voluntary-work-role.js');
const workOverseasValidators = require('./field-validators/work-overseas.js');
const universalCreditValidators = require('./field-validators/universal-credit.js');
// coronavirus
const coronavirusReasonForClaimValidators = require('./field-validators/coronavirus-reason-for-claim.js');
const coronavirusDateValidators = require('./field-validators/coronavirus-date.js');
const coronavirusOtherConditionValidators = require('./field-validators/coronavirus-other-condition.js');
const coronaValidator = require('./field-validators/coronavirus');
const disabilityOrHealthConditionValidator = require('./field-validators/disability-or-health-condition');
const notEligibleDisablityHealthConditionValidator = require('./field-validators/not-eligible-disability-or-health-condition');
const statePensionAgeValidator = require('./field-validators/state-pension-age');
const nationalInsuranceValidator = require('./field-validators/national-insurance');
const getNationalInsuranceCreditsValidator = require('./field-validators/get-national-insurance-credits');
const statutoryPayValidator = require('./field-validators/statutory-pay');
const statutoryPayEndDateValidator = require('./field-validators/statutory-pay-end-date');
const claimStartDateAfterSsp = require('./field-validators/claim-start-date-after-statutory-sick-pay');

const navigateToNextPage = require('../lib/navigation-rules');

function checkForErrors(req, page) {
  const validationErrors = req.journeyData.getValidationErrorsForPage(page);
  return validationErrors && Object.keys(validationErrors).length > 0;
}

module.exports = {

  // accessibility
  'accessibility-statement': {
    view: 'pages/accessibility-statement',
  },

  'who-is-applying': {
    view: 'pages/who-is-applying.njk',
    fieldValidators: whoIsApplyingValidator,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'who-is-applying');
        req.journeyData.setDataForPage('eligibility-start-visited', false);
        req.journeyData.setDataForPage('help-someone-apply-visited', false);
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'cannot-apply-online': {
    view: 'pages/cannot-apply-online',
    hooks: {
      prerender: (req, res, next) => {
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'helping-someone-apply': {
    view: 'pages/helping-someone-apply',
    hooks: {
      prerender: (req, res, next) => {
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  // eligibility
  'eligibility-start': {
    view: 'pages/eligibility-start.njk',
    hooks: {
      prerender: (req, res, next) => {
        req.journeyData.setDataForPage('eligibility-start-visited', true);
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  coronavirus: {
    view: 'pages/coronavirus.njk',
    fieldValidators: coronaValidator,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'coronavirus');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'disability-or-health-condition': {
    view: 'pages/disability-or-health-condition.njk',
    fieldValidators: disabilityOrHealthConditionValidator,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'disability-or-health-condition');
        next();
      },
    },
  },

  'not-eligible-disability-or-health-condition': {
    view: 'pages/not-eligible-disability-or-health-condition.njk',
    fieldValidators: notEligibleDisablityHealthConditionValidator,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'not-eligible-disability-or-health-condition');
        next();
      },
      preredirect: (req, res, next) => {
        if (req.journeyData.getDataForPage('not-eligible-disability-or-health-condition').whatDoYouWantToDo === 'uc') {
          res.status(302).redirect('https://www.gov.uk/universal-credit');
        } else if (req.journeyData.getDataForPage('not-eligible-disability-or-health-condition').whatDoYouWantToDo === 'nsjsa') {
          res.status(302).redirect('https://www.gov.uk/jobseekers-allowance');
        } else {
          next();
        }
      },
    },
  },

  'state-pension-age': {
    view: 'pages/state-pension-age.njk',
    fieldValidators: statePensionAgeValidator,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'state-pension-age');
        next();
      },
    },
  },

  'not-eligible-state-pension': {
    view: 'pages/not-eligible-state-pension',
  },

  'national-insurance': {
    view: 'pages/national-insurance',
    fieldValidators: nationalInsuranceValidator,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'national-insurance');
        next();
      },
    },
  },

  'get-national-insurance-credits': {
    view: 'pages/get-national-insurance-credits.njk',
    fieldValidators: getNationalInsuranceCreditsValidator,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'get-national-insurance-credits');
        next();
      },
      preredirect: (req, res, next) => {
        if (req.journeyData.getDataForPage('get-national-insurance-credits').whatDoYouWantToDo === 'uc') {
          res.status(302).redirect('https://www.gov.uk/universal-credit');
        } else {
          next();
        }
      },
    },
  },

  'statutory-pay': {
    view: 'pages/statutory-pay',
    fieldValidators: statutoryPayValidator,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'statutory-pay');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'statutory-pay-end-date': {
    view: 'pages/statutory-pay-end-date',
    fieldValidators: statutoryPayEndDateValidator,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'statutory-pay-end-date');
        next();
      },
    },
  },

  'not-eligible-statutory-pay': {
    view: 'pages/not-eligible-statutory-pay',
    hooks: {
      prerender: (req, res, next) => {
        res.locals.statutoryPayType = req.journeyData.getDataForPage('statutory-pay').statutoryPay;
        res.locals.errorsFlag = checkForErrors(req, 'statutory-pay-end-date');
        next();
      },
    },
  },

  'may-be-eligible': {
    view: 'pages/may-be-eligible',
  },

  // main flow
  address: {
    view: 'pages/address.njk',
    fieldValidators: addressValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'address');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'correspondence-address': {
    view: 'pages/correspondence-address.njk',
    fieldValidators: correspondenceAddressValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'address');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'language-preference-writing': {
    view: 'pages/language-preference-writing.njk',
    fieldValidators: langPrefWritingValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'language-preference-writing');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'language-preference-speaking': {
    view: 'pages/language-preference-speaking.njk',
    fieldValidators: langPrefSpeakingValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'language-preference-speaking');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'bank-details': {
    view: 'pages/bank-details.njk',
    fieldValidators: bankDetailsValidators,
    hooks: {
      prerender: (req, res, next) => {
        req.journeyData.setDataForPage('bank-details', undefined);
        next();
      },
    },
  },

  'claim-end-date': {
    view: 'pages/claim-end-date.njk',
    fieldValidators: claimEndDateValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.claimEndDateHint = moment()
          .add(2, 'months')
          .format('D M YYYY');
        if (typeof req.journeyData.getDataForPage('claim-start-date-after-statutory-sick-pay')
          !== 'undefined' && req.journeyData.getDataForPage('claim-start-date-after-statutory-sick-pay').claimStartDateAfterSsp === 'yes') {
          const { sspEndDate } = req.journeyData.getDataForPage('statutory-sick-pay-end');
          const dayAfterSspEndDate = moment(`${sspEndDate.yyyy}-${sspEndDate.mm}-${sspEndDate.dd}`, 'YYYY-MM-DD').add(1, 'days').add(1, 'months');
          res.locals.hiddenClaimStartDate = `{"dd":"${dayAfterSspEndDate.date()}","mm":"${dayAfterSspEndDate.month()}","yyyy":"${dayAfterSspEndDate.year()}"}`;
        } else {
          res.locals.hiddenClaimStartDate = JSON.stringify(req.journeyData.getDataForPage('claim-start-date').claimStartDate);
        }
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'claim-start-date': {
    view: 'pages/claim-start-date.njk',
    fieldValidators: claimStartDateValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.claimStartDateHint = moment()
          .format('D M YYYY');
        res.locals.errorsFlag = checkForErrors(req, 'claim-start-date');
        res.locals.hiddenSspEndDate = (typeof req.journeyData.getDataForPage('statutory-sick-pay-end') !== 'undefined'
          && typeof req.journeyData.getDataForPage('statutory-sick-pay-end').sspEndDate !== 'undefined')
          ? JSON.stringify(req.journeyData.getDataForPage('statutory-sick-pay-end').sspEndDate) : 'not-entered';
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'late-claim': {
    view: 'pages/late-claim.njk',
    fieldValidators: lateClaimValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'late-claim');
        res.locals.claimStartDate = req.journeyData.getDataForPage('claim-start-date').claimStartDate;
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  conditions: {
    view: 'pages/conditions.njk',
    fieldValidators: conditionsValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'conditions');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'another-health-condition': {
    view: 'pages/another-health-condition.njk',
    fieldValidators: anotherHealthConditionValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.conditionGather = req.session.conditionGather || [];
        res.locals.errorsFlag = checkForErrors(req, 'another-health-condition');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'consent-outcome': {
    view: 'pages/consent-outcome.njk',
    fieldValidators: consentOutcomeValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'consent-outcome');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'date-of-birth': {
    view: 'pages/date-of-birth.njk',
    fieldValidators: dateOfBirthValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.dateOfBirthHint = moment()
          .subtract(16, 'years')
          .format('D M YYYY');
        res.locals.errorsFlag = checkForErrors(req, 'date-of-birth');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'doctor-declaration': {
    view: 'pages/doctor-declaration.njk',
    fieldValidators: doctorDeclarationValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'doctor-declaration');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'ds1500-report': {
    view: 'pages/ds1500-report.njk',
    fieldValidators: ds1500ReportValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'ds1500-report');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  email: {
    view: 'pages/email.njk',
    fieldValidators: emailValidator,
    fieldGatherModifiers: trimWhiteSpace,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'email');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  employed: {
    view: 'pages/employed.njk',
    fieldValidators: employedValidators,
    hooks: {
      prerender: (req, res, next) => {
        // this is added to ensure that the backlink is given the correct
        // value when on a gateway page in a loop
        if (req.session.employmentGather && req.session.employmentGather.length > 0) {
          const lastEntry = req.session.employmentGather[req.session.employmentGather.length - 1];
          if (lastEntry.offSick === 'yes') {
            res.locals.casa.journeyPreviousUrl = '/employment-status';
          } else if (lastEntry.expensesDetails) {
            res.locals.casa.journeyPreviousUrl = '/employment-expenses-details';
          } else if (lastEntry.expenses === 'no') {
            res.locals.casa.journeyPreviousUrl = '/employment-expenses';
          }
        }
        res.locals.employmentGather = req.session.employmentGather || [];
        res.locals.errorsFlag = checkForErrors(req, 'employed');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'self-employment-details': {
    view: 'pages/self-employment-details.njk',
    fieldValidators: selfEmploymentDetailsValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'self-employment-details');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'employment-details': {
    view: 'pages/employment-details.njk',
    fieldValidators: employmentDetailsValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'employment-details');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'employment-expenses': {
    view: 'pages/employment-expenses.njk',
    fieldValidators: employmentExpensesValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.cancelForm = true;
        res.locals.employerName = getEmployerName(req);
        res.locals.errorsFlag = checkForErrors(req, 'employment-expenses');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'employment-expenses-details': {
    view: 'pages/employment-expenses-details.njk',
    fieldValidators: employmentExpensesDetailsValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.cancelForm = true;
        res.locals.employerName = getEmployerName(req);
        res.locals.errorsFlag = checkForErrors(req, 'employment-expenses-details');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'employment-hours': {
    view: 'pages/employment-hours.njk',
    fieldValidators: employmentHoursValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.employerName = getEmployerName(req);
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'employment-hours');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'employment-last-work': {
    view: 'pages/employment-last-work.njk',
    fieldValidators: employmentLastWorkValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.employerName = getEmployerName(req);
        res.locals.lastWorkedDateHint = moment()
          .subtract(2, 'weeks')
          .format('D M YYYY');
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'employment-last-work');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'employment-off-sick': {
    view: 'pages/employment-off-sick.njk',
    fieldValidators: employmentOffSickValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.employerName = getEmployerName(req);
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'employment-off-sick');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'employment-pay-frequency-samehours': {
    view: 'pages/employment-pay-frequency-samehours.njk',
    fieldValidators: employmentPayFrequencySameHoursValidators,
    hooks: {
      prerender: (req, res, next) => {
        const { hours } = req.journeyData.getDataForPage('employment-hours');
        res.locals.sameHours = hours && hours !== '0';
        res.locals.employerName = getEmployerName(req);
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'employment-pay-frequency-samehours');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'employment-pay-frequency-other': {
    view: 'pages/employment-pay-frequency-other.njk',
    fieldValidators: employmentPayFrequencyOtherValidators,
    hooks: {
      prerender: (req, res, next) => {
        const { hours } = req.journeyData.getDataForPage('employment-hours');
        res.locals.sameHours = hours && hours !== '0';
        res.locals.employerName = getEmployerName(req);
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'employment-pay-frequency-other');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },
  'employment-status': {
    view: 'pages/employment-status.njk',
    fieldValidators: employmentStatusValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'employment-status');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'employment-support': {
    view: 'pages/employment-support.njk',
    fieldValidators: employmentSupportValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.employerName = getEmployerName(req);
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'employment-support');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'hospital-inpatient': {
    view: 'pages/hospital-inpatient.njk',
    fieldValidators: hospitalInpatientValidators,
    hooks: {
      prerender: (req, res, next) => {
        next();
        res.locals.errorsFlag = checkForErrors(req, 'hospital-inpatient');
      },
      preredirect: navigateToNextPage,
    },
  },

  'hospital-details': {
    view: 'pages/hospital-details.njk',
    fieldValidators: hospitalDetailsValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.admissionDateHint = moment()
          .subtract(2, 'months')
          .format('D M YYYY');
        next();
        res.locals.errorsFlag = checkForErrors(req, 'hospital-details');
      },
      preredirect: navigateToNextPage,
    },
  },

  insurance: {
    view: 'pages/insurance.njk',
    fieldValidators: insuranceValidators,
    hooks: {
      prerender: (req, res, next) => {
        // this is added to ensure that the backlink is given the correct
        // value when on a gateway page in a loop
        if (req.session.insuranceGather && req.session.insuranceGather.length > 0) {
          res.locals.casa.journeyPreviousUrl = '/insurance-payment';
        }
        res.locals.insuranceGather = req.session.insuranceGather || [];
        res.locals.errorsFlag = checkForErrors(req, 'insurance');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'medical-centre': {
    view: 'pages/medical-centre.njk',
    fieldValidators: medicalCentreValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'medical-centre');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'military-overseas': {
    view: 'pages/military-overseas.njk',
    fieldValidators: militaryOverseasValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'military-overseas');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  mobile: {
    view: 'pages/mobile.njk',
    fieldValidators: mobileValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'mobile');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  name: {
    view: 'pages/name.njk',
    fieldValidators: nameValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'name');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'national-insurance-number': {
    view: 'pages/national-insurance-number.njk',
    fieldValidators: ninoValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'national-insurance-number');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'other-number': {
    view: 'pages/other-number.njk',
    fieldValidators: otherNumberValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'other-number');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  pension: {
    view: 'pages/pension.njk',
    fieldValidators: pensionValidators,
    hooks: {
      prerender: (req, res, next) => {
        // this is added to ensure that the backlink is given the correct
        // value when on a gateway page in a loop
        if (req.session.pensionGather && req.session.pensionGather.length > 0) {
          res.locals.casa.journeyPreviousUrl = '/pension-inherited';
        }
        res.locals.pensionGather = req.session.pensionGather || [];
        res.locals.errorsFlag = checkForErrors(req, 'pension');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'pension-inherit': {
    view: 'pages/pension-inherit.njk',
    fieldValidators: pensionInheritValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'pension-inherit');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  pregnant: {
    view: 'pages/pregnant.njk',
    fieldValidators: pregnantValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'pregnant');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'pregnant-due-date': {
    view: 'pages/pregnant-due-date.njk',
    fieldValidators: pregnantDueDateValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.dueDateHint = moment()
          .add(5, 'months')
          .format('D M YYYY');
        res.locals.errorsFlag = checkForErrors(req, 'pregnant-due-date');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'live-less-than-12-months': {
    view: 'pages/live-less-than-12-months.njk',
    fieldValidators: liveLessThanTwelveMonthsValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'live-less-than-12-months');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'statutory-pay-other': {
    view: 'pages/statutory-pay-other.njk',
    fieldValidators: statutoryPayOtherValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'statutory-pay-other');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'statutory-sick-pay-end': {
    view: 'pages/ssp-end.njk',
    fieldValidators: sspEndValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.sspEndDateHint = moment()
          .add(2, 'weeks')
          .format('D M YYYY');
        res.locals.errorsFlag = checkForErrors(req, 'statutory-sick-pay-end');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'statutory-sick-pay-recent': {
    view: 'pages/ssp-recent.njk',
    fieldValidators: sspRecentValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'statutory-sick-pay-recent');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'voluntary-work': {
    view: 'pages/voluntary-work.njk',
    fieldValidators: voluntaryWorkValidators,
    hooks: {
      prerender: (req, res, next) => {
        // this is added to ensure that the backlink is given the correct
        // value when on a gateway page in a loop
        if (req.session.voluntaryGather && req.session.voluntaryGather.length > 0) {
          res.locals.casa.journeyPreviousUrl = '/voluntary-work-hours';
        }
        res.locals.voluntaryGather = req.session.voluntaryGather || [];
        res.locals.errorsFlag = checkForErrors(req, 'voluntary-work');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'voluntary-work-details': {
    view: 'pages/voluntary-work-details.njk',
    fieldValidators: voluntaryWorkDetailsValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'voluntary-work-details');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'voluntary-work-hours': {
    view: 'pages/voluntary-work-hours.njk',
    fieldValidators: voluntaryWorkHoursValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.organisationName = req.journeyData.getDataForPage('voluntary-work-details').organisationName;
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'voluntary-work-hours');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'voluntary-work-role': {
    view: 'pages/voluntary-work-role.njk',
    fieldValidators: voluntaryWorkRoleValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.organisationName = req.journeyData.getDataForPage('voluntary-work-details').organisationName;
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'voluntary-work-role');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'work-overseas': {
    view: 'pages/work-overseas.njk',
    fieldValidators: workOverseasValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'work-overseas');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'universal-credit': {
    view: 'pages/universal-credit.njk',
    fieldValidators: universalCreditValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'universal-credit');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'claim-start-date-after-statutory-sick-pay': {
    view: 'pages/claim-start-date-after-statutory-sick-pay.njk',
    fieldValidators: claimStartDateAfterSsp,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.sspEndDate = req.journeyData.getDataForPage('statutory-sick-pay-end').sspEndDate;
        res.locals.errorsFlag = checkForErrors(req, 'claim-start-date-after-statutory-sick-pay');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  // Coronavirus
  'coronavirus-reason-for-claim': {
    view: 'pages/coronavirus-reason-for-claim.njk',
    fieldValidators: coronavirusReasonForClaimValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'coronavirus-reason-for-claim');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'coronavirus-date': {
    view: 'pages/coronavirus-date.njk',
    fieldValidators: coronavirusDateValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'coronavirus-date');
        res.locals.coronavirusReason = req.session.journeyData['coronavirus-reason-for-claim'].coronavirusReasonForClaim;
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'coronavirus-other-condition': {
    view: 'pages/coronavirus-other-condition.njk',
    fieldValidators: coronavirusOtherConditionValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'coronavirus-other-condition');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },
};
