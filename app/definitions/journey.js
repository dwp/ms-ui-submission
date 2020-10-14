const UserJourney = require('@dwp/govuk-casa/lib/UserJourney');

module.exports = (() => {
  const startApplication = new UserJourney.Road();
  const voluntaryWorkPath = new UserJourney.Road();
  const voluntaryWorkDetailsPath = new UserJourney.Road();
  const employedPath = new UserJourney.Road();
  const employmentDetailsPath = new UserJourney.Road();
  const employmentHoursPath = new UserJourney.Road();
  const employmentNetPaySameHoursPath = new UserJourney.Road();
  const employmentNetPayOtherPath = new UserJourney.Road();
  const restOfEmployedPath = new UserJourney.Road();
  const sspEndPath = new UserJourney.Road();
  const sspRecentPath = new UserJourney.Road();
  const statutoryPayOtherPath = new UserJourney.Road();
  const pensionPath = new UserJourney.Road();
  // const pensionDetailsPath = new UserJourney.Road();
  const insurancePath = new UserJourney.Road();
  // const insuranceDetailsPath = new UserJourney.Road();
  const restOfJourney = new UserJourney.Road();
  // coronavirus
  const coronaReasonPath = new UserJourney.Road();
  const coronaPath = new UserJourney.Road();
  const conditionsPath = new UserJourney.Road();
  const healthPath = new UserJourney.Road();

  const eligibilityCoronaPath = new UserJourney.Road();
  const eligibilityHealthConditions = new UserJourney.Road();
  const eligibilityChecks = new UserJourney.Road();
  const eligibilityStatutoryPayPath = new UserJourney.Road();
  const eligibilityEndPath = new UserJourney.Road();

  eligibilityCoronaPath.addWaypoints([
    'coronavirus',
  ]);

  eligibilityCoronaPath.fork([eligibilityChecks, eligibilityHealthConditions], (choices, sessionData) => (sessionData.coronavirus.coronavirusReasonForClaim === 'yes' ? choices[0] : choices[1]));

  eligibilityHealthConditions.addWaypoints([
    'disability-or-health-condition',
    ['not-eligible-disability-or-health-condition', (sessionData) => sessionData['disability-or-health-condition'].disabilityOrHealthCondition === 'no'],
  ]);

  eligibilityHealthConditions.mergeWith(eligibilityChecks);

  eligibilityChecks.addWaypoints([
    'state-pension-age',
    ['not-eligible-state-pension', (sessionData) => sessionData['state-pension-age'].statePensionAge === 'no'],
    'national-insurance',
    ['get-national-insurance-credits', (sessionData) => sessionData['national-insurance'].nationalInsurance === 'no'],
    'statutory-pay',
  ]);

  eligibilityChecks.fork([eligibilityEndPath, eligibilityStatutoryPayPath], (choices, sessionData) => (sessionData['statutory-pay'].statutoryPay === 'no' ? choices[0] : choices[1]));

  eligibilityStatutoryPayPath.addWaypoints([
    'statutory-pay-end-date',
    ['not-eligible-statutory-pay', (sessionData) => sessionData['statutory-pay-end-date'].statutoryPayEndDate === 'no'],
  ]);

  eligibilityStatutoryPayPath.mergeWith(eligibilityEndPath);

  eligibilityEndPath.addWaypoints([
    'severe-disability-premium',
    ['not-eligible-severe-disability-premium', (sessionData) => sessionData['severe-disability-premium'].severeDisabilityPremium === 'yes'],
    ['check-if-you-get-severe-disability-premium', (sessionData) => sessionData['severe-disability-premium'].severeDisabilityPremium === 'notSure'],
    {
      id: 'may-be-eligible',
      // Always consider this waypoint passable as it's static content
      is_passable: () => true,
    },
  ]);

  eligibilityEndPath.mergeWith(startApplication);

  startApplication.addWaypoints([
    'name',
    'date-of-birth',
    'nino',
    'address',
    'mobile',
    ['other-number', (sessionData) => sessionData.mobile.mobile === 'no'],
  ]);

  startApplication.fork([coronaReasonPath, conditionsPath], (choices, sessionData) => (sessionData.coronavirus.coronavirusReasonForClaim === 'yes' ? choices[0] : choices[1]));

  coronaReasonPath.addWaypoints([
    'coronavirus-reason-for-claim',
    ['coronavirus-shielding', (sessionData) => sessionData['coronavirus-reason-for-claim'].coronavirusReasonForClaim === 'high-risk'],
  ]);

  coronaReasonPath.mergeWith(coronaPath);

  coronaPath.addWaypoints([
    'coronavirus-date',
    ['coronavirus-other-condition', (sessionData) => sessionData['coronavirus-reason-for-claim'].coronavirusReasonForClaim !== 'high-risk'],
  ]);

  coronaPath.fork([conditionsPath, healthPath], (choices, sessionData) => ((typeof sessionData['coronavirus-other-condition'] === 'undefined' || typeof sessionData['coronavirus-other-condition'].coronavirusOtherCondition === 'undefined' || sessionData['coronavirus-other-condition'].coronavirusOtherCondition === 'yes') ? choices[0] : choices[1]));

  conditionsPath.addWaypoints([
    'conditions',
  ]);

  conditionsPath.mergeWith(healthPath);

  healthPath.addWaypoints([
    'medical-centre',
    'severe-condition',
    ['ds1500-report', (sessionData) => sessionData['severe-condition'].severeCondition === 'yes'],
    'hospital-inpatient',
    'pregnant',
    'doctor-declaration',
  ]);

  healthPath.mergeWith(voluntaryWorkPath);

  voluntaryWorkPath.addWaypoints([
    'voluntary-work',
  ]);
  voluntaryWorkPath.fork(
    [voluntaryWorkDetailsPath, employedPath],
    (choices, context) => (typeof context['voluntary-work'] !== 'undefined'
      && (context['voluntary-work'].voluntaryWork === 'yes' || context['voluntary-work'].other === 'yes')
      ? choices[0] : choices[1]),
  );
  voluntaryWorkDetailsPath.addWaypoints([
    'voluntary-work-details',
    'voluntary-work-role',
    'voluntary-work-hours',
  ]);
  voluntaryWorkDetailsPath.mergeWith(voluntaryWorkPath);

  employedPath.addWaypoints([
    'employed',
  ]);
  employedPath.fork(
    [employmentDetailsPath, sspRecentPath, sspEndPath],
    (choices, context) => {
      if (context['statutory-pay'].statutoryPay === 'yes') {
        if (context.employed.employed === 'no' || context.employed.other === 'no') {
          return choices[2];
        }
      } else if (context.employed.employed === 'no' || context.employed.other === 'no') {
        return choices[1];
      }
      return choices[0];
    },
  );
  employmentDetailsPath.addWaypoints([
    'employment-details',
    'employment-off-sick',
    ['employment-last-work', (sessionData) => sessionData['employment-off-sick'].offSick === 'yes'],
    'employment-status',
  ]);
  employmentDetailsPath.fork(
    [employmentHoursPath, employedPath],
    (choices, context) => (typeof context['employment-off-sick'] !== 'undefined'
      && (context['employment-off-sick'].offSick === 'no')
      ? choices[0] : choices[1]),
  );
  employmentHoursPath.addWaypoints([
    'employment-hours',
  ]);
  employmentHoursPath.fork(
    [employmentNetPayOtherPath, employmentNetPaySameHoursPath],
    (choices, context) => (typeof context['employment-hours'] !== 'undefined'
      && (context['employment-hours'].sameHours === 'no' || context['employment-hours'].hours === '0')
      ? choices[0] : choices[1]),
  );
  employmentNetPaySameHoursPath.addWaypoints([
    'employment-pay-frequency-samehours',
  ]);
  employmentNetPaySameHoursPath.mergeWith(restOfEmployedPath);
  employmentNetPayOtherPath.addWaypoints([
    'employment-pay-frequency-other',
  ]);
  employmentNetPayOtherPath.mergeWith(restOfEmployedPath);
  restOfEmployedPath.addWaypoints([
    'employment-support',
    'employment-expenses',
    ['employment-expenses-details', (sessionData) => sessionData['employment-expenses'].expenses === 'yes'],
  ]);
  restOfEmployedPath.mergeWith(employedPath);

  sspEndPath.addWaypoints([
    'statutory-sick-pay-end',
  ]);
  sspEndPath.mergeWith(statutoryPayOtherPath);

  sspRecentPath.addWaypoints([
    'statutory-sick-pay-recent',
    ['statutory-sick-pay-recent-end', (sessionData) => sessionData['statutory-sick-pay-recent'].sspRecent === 'yes'],
  ]);
  sspRecentPath.mergeWith(statutoryPayOtherPath);

  statutoryPayOtherPath.addWaypoints([
    'statutory-pay-other',
    'universal-credit',
    'claim-start-date',
    'claim-end-date',
    'work-overseas',
    'military-overseas',
  ]);
  statutoryPayOtherPath.mergeWith(pensionPath);

  pensionPath.addWaypoints([
    'pension',
  ]);
  /*  pensionPath.fork(
      [pensionDetailsPath, insurancePath],
      (choices, context) => (typeof context.pension !== 'undefined'
        && (context.pension.pension === 'yes' || context.pension.other === 'yes')
        ? choices[0] : choices[1]),
    );

    pensionDetailsPath.addWaypoints([
      'pension-details',
      'pension-start',
      'pension-frequency',
      'pension-deductions',
      'pension-payment',
      ['pension-deductions-details', (sessionData) =>
          sessionData['pension-deductions'].deductions === 'yes'],
      'pension-inherited',
    ]);
    pensionDetailsPath.mergeWith(pensionPath);  */
  pensionPath.mergeWith(insurancePath);

  insurancePath.addWaypoints([
    'insurance',
  ]);
  /*  insurancePath.fork(
      [insuranceDetailsPath, restOfJourney],
      (choices, context) => (typeof context.insurance !== 'undefined'
        && (context.insurance.insurance === 'yes' || context.insurance.other === 'yes')
        ? choices[0] : choices[1]),
    );

    insuranceDetailsPath.addWaypoints([
      'insurance-details',
      'insurance-premiums',
      ['insurance-employer', (sessionData) => sessionData['insurance-premiums'].premiums !== 'yes'],
      'insurance-payment',
    ]);
    insuranceDetailsPath.mergeWith(insurancePath);  */

  insurancePath.mergeWith(restOfJourney);

  restOfJourney.addWaypoints([
    'bank-details',
    'consent-outcome',
    'check-your-answers',
  ]);
  restOfJourney.end();

  const journey = new UserJourney.Map();
  journey.startAt(eligibilityCoronaPath);
  return journey;
})();
