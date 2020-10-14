const moment = require('moment');
const addressValidators = require('./field-validators/address.js');
const bankDetailsValidators = require('./field-validators/bank-details.js');
const claimEndDateValidators = require('./field-validators/claim-end-date.js');
const claimStartDateValidators = require('./field-validators/claim-start-date.js');
const conditionsValidators = require('./field-validators/conditions');
const dateOfBirthValidators = require('./field-validators/date-of-birth.js');
const doctorDeclarationValidators = require('./field-validators/doctor-declaration.js');
const consentOutcomeValidators = require('./field-validators/consent-outcome.js');
const ds1500ReportValidators = require('./field-validators/ds1500-report.js');
const employedValidators = require('./field-validators/employed.js');
const employmentDetailsValidators = require('./field-validators/employment-details.js');
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
const insuranceValidators = require('./field-validators/insurance.js');
const insuranceDetailsValidators = require('./field-validators/insurance-details.js');
const insuranceEmployerValidators = require('./field-validators/insurance-employer.js');
const insurancePaymentValidators = require('./field-validators/insurance-payment.js');
const insurancePremiumsValidators = require('./field-validators/insurance-premiums.js');
const medicalCentreValidators = require('./field-validators/medical-centre.js');
const militaryOverseasValidators = require('./field-validators/military-overseas.js');
const mobileValidators = require('./field-validators/mobile.js');
const nameValidators = require('./field-validators/name.js');
const ninoValidators = require('./field-validators/nino.js');
const otherNumberValidators = require('./field-validators/other-number.js');
const pensionValidators = require('./field-validators/pension.js');
const pensionDeductionsValidators = require('./field-validators/pension-deductions.js');
const pensionDeductionsDetailsValidators = require('./field-validators/pension-deductions-details.js');
const pensionDetailsValidators = require('./field-validators/pension-details.js');
const pensionFrequencyValidators = require('./field-validators/pension-frequency.js');
const pensionInheritedValidators = require('./field-validators/pension-inherited.js');
const pensionPaymentValidators = require('./field-validators/pension-payment.js');
const pensionStartValidators = require('./field-validators/pension-start.js');
const pregnantValidators = require('./field-validators/pregnant.js');
const severeConditionValidators = require('./field-validators/severe-condition.js');
const sspEndValidators = require('./field-validators/ssp-end.js');
const sspRecentValidators = require('./field-validators/ssp-recent.js');
const sspRecentEndValidators = require('./field-validators/ssp-recent-end.js');
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
const coronavirusShieldingValidators = require('./field-validators/coronavirus-shielding.js');
const coronaValidator = require('./field-validators/coronavirus');
const disabilityOrHealthConditionValidator = require('./field-validators/disability-or-health-condition');
const notEligibleDisablityHealthConditionValidator = require('./field-validators/not-eligible-disability-or-health-condition');
const statePensionAgeValidator = require('./field-validators/state-pension-age');
const nationalInsuranceValidator = require('./field-validators/national-insurance');
const getNationalInsuranceCreditsValidator = require('./field-validators/get-national-insurance-credits');
const statutoryPayValidator = require('./field-validators/statutory-pay');
const statutoryPayEndDateValidator = require('./field-validators/statutory-pay-end-date');
const severeDisabilityPremiumValidator = require('./field-validators/severe-disability-premium');

const { genericDataUtils } = require('../lib/data-utils');
const navigateToNextPage = require('../lib/navigation-rules');

function checkForErrors(req, page) {
  const validationErrors = req.journeyData.getValidationErrorsForPage(page);
  return validationErrors && Object.keys(validationErrors).length > 0;
}

module.exports = {

  'accessibility-statement': {
    view: 'pages/accessibility-statement',
  },

  // eligibility
  'eligibility-start': {
    view: 'pages/eligibility-start.njk',
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
          res.status(302).redirect('https://www.gov.uk/how-to-claim-universal-credit');
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
          res.status(302).redirect('https://www.gov.uk/how-to-claim-universal-credit');
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

  'severe-disability-premium': {
    view: 'pages/severe-disability-premium',
    fieldValidators: severeDisabilityPremiumValidator,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'severe-disability-premium');
        next();
      },
    },
  },

  'not-eligible-severe-disability-premium': {
    view: 'pages/not-eligible-severe-disability-premium',
  },

  'check-if-you-get-severe-disability-premium': {
    view: 'pages/check-if-you-get-severe-disability-premium',
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
          .subtract(2, 'months')
          .format('D M YYYY');
        res.locals.hiddenClaimStartDate = JSON.stringify(req.journeyData.getDataForPage('claim-start-date').claimStartDate);
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
          .subtract(3, 'months')
          .format('D M YYYY');
        res.locals.errorsFlag = checkForErrors(req, 'claim-start-date');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  conditions: {
    view: 'pages/conditions.njk',
    fieldValidators: conditionsValidators,
    hooks: {
      pregather: (req, res, next) => {
        if (typeof req.body.conditions === 'object') {
          req.body.conditions = genericDataUtils.convertToArrayAndFilterBlanks(req.body.conditions);
        }
        next();
      },
      prerender: (req, res, next) => {
        const errors = req.journeyData.getValidationErrorsForPage('conditions');
        Object.keys(errors).forEach((field) => {
          const err = errors[field];
          // field is in format 'conditions[<CONDITION_NUMBER>][<FIELD>]' e.g. conditions[0][name]
          // create index from <CONDITION_NUMBER>
          const index = field.slice((field.indexOf('[') + 1), field.indexOf(']'));

          const { inline, summary } = err[0];
          const ordinal = `conditions:ordinals.${parseInt(index)}`; // eslint-disable-line radix
          err[0].inline = res.locals.t(inline, res.locals.t(ordinal));
          err[0].summary = res.locals.t(summary, res.locals.t(ordinal));
        });

        res.locals.errorsFlag = checkForErrors(req, 'conditions');
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
        res.locals.employerName = req.journeyData.getDataForPage('employment-details').employerName;
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
        res.locals.employerName = req.journeyData.getDataForPage('employment-details').employerName;
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
        res.locals.employerName = req.journeyData.getDataForPage('employment-details').employerName;
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
        res.locals.employerName = req.journeyData.getDataForPage('employment-details').employerName;
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
        res.locals.employerName = req.journeyData.getDataForPage('employment-details').employerName;
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
        res.locals.employerName = req.journeyData.getDataForPage('employment-details').employerName;
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
        res.locals.employerName = req.journeyData.getDataForPage('employment-details').employerName;
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
        res.locals.employerName = req.journeyData.getDataForPage('employment-details').employerName;
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
        res.locals.employerName = req.journeyData.getDataForPage('employment-details').employerName;
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
        res.locals.admissionDateHint = moment()
          .subtract(2, 'months')
          .format('D M YYYY');
        next();
        res.locals.errorsFlag = checkForErrors(req, 'hospital-inpatient');
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

  'insurance-details': {
    view: 'pages/insurance-details.njk',
    fieldValidators: insuranceDetailsValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'insurance-details');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'insurance-employer': {
    view: 'pages/insurance-employer.njk',
    fieldValidators: insuranceEmployerValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.insuranceProvider = req.journeyData.getDataForPage('insurance-details').insuranceProvider;
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'insurance-employer');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'insurance-payment': {
    view: 'pages/insurance-payment.njk',
    fieldValidators: insurancePaymentValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.insuranceProvider = req.journeyData.getDataForPage('insurance-details').insuranceProvider;
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'insurance-payment');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'insurance-premiums': {
    view: 'pages/insurance-premiums.njk',
    fieldValidators: insurancePremiumsValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.insuranceProvider = req.journeyData.getDataForPage('insurance-details').insuranceProvider;
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'insurance-premiums');
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

  nino: {
    view: 'pages/nino.njk',
    fieldValidators: ninoValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'nino');
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

  'pension-deductions': {
    view: 'pages/pension-deductions.njk',
    fieldValidators: pensionDeductionsValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.pensionProvider = req.journeyData.getDataForPage('pension-details').pensionProvider;
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'pension-deductions');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'pension-deductions-details': {
    view: 'pages/pension-deductions-details.njk',
    fieldValidators: pensionDeductionsDetailsValidators,
    hooks: {
      pregather: (req, res, next) => {
        if (typeof req.body.deductionsDetails === 'object') {
          req.body.deductionsDetails = genericDataUtils
            .convertToArrayAndFilterBlanks(req.body.deductionsDetails);
        }
        next();
      },
      prerender: (req, res, next) => {
        res.locals.pensionProvider = req.journeyData.getDataForPage('pension-details').pensionProvider;
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'pension-deductions-details');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'pension-details': {
    view: 'pages/pension-details.njk',
    fieldValidators: pensionDetailsValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'pension-details');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'pension-frequency': {
    view: 'pages/pension-frequency.njk',
    fieldValidators: pensionFrequencyValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.pensionProvider = req.journeyData.getDataForPage('pension-details').pensionProvider;
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'pension-frequency');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'pension-inherited': {
    view: 'pages/pension-inherited.njk',
    fieldValidators: pensionInheritedValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.pensionProvider = req.journeyData.getDataForPage('pension-details').pensionProvider;
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'pension-inherited');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'pension-payment': {
    view: 'pages/pension-payment.njk',
    fieldValidators: pensionPaymentValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.deductions = req.journeyData.getDataForPage('pension-deductions').deductions === 'yes';
        res.locals.pensionProvider = req.journeyData.getDataForPage('pension-details').pensionProvider;
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'pension-payment');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'pension-start': {
    view: 'pages/pension-start.njk',
    fieldValidators: pensionStartValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.pensionProvider = req.journeyData.getDataForPage('pension-details').pensionProvider;
        res.locals.cancelForm = true;
        res.locals.errorsFlag = checkForErrors(req, 'pension-start');
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
        res.locals.dueDateHint = moment()
          .add(5, 'months')
          .format('D M YYYY');
        res.locals.errorsFlag = checkForErrors(req, 'pregnant');
        next();
      },
      preredirect: navigateToNextPage,
    },
  },

  'severe-condition': {
    view: 'pages/severe-condition.njk',
    fieldValidators: severeConditionValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'severe-condition');
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

  'statutory-sick-pay-recent-end': {
    view: 'pages/ssp-recent-end.njk',
    fieldValidators: sspRecentEndValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.sspRecentEndDateHint = moment()
          .subtract(2, 'weeks')
          .format('D M YYYY');
        res.locals.errorsFlag = checkForErrors(req, 'statutory-sick-pay-recent-end');
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

  'coronavirus-shielding': {
    view: 'pages/coronavirus-shielding.njk',
    fieldValidators: coronavirusShieldingValidators,
    hooks: {
      prerender: (req, res, next) => {
        res.locals.errorsFlag = checkForErrors(req, 'coronavirus-shielding');
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
        if (req.session.journeyData['coronavirus-reason-for-claim'].coronavirusReasonForClaim === 'high-risk') {
          res.locals.isShielding = req.session.journeyData['coronavirus-shielding'].coronavirusShielding;
        }
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
