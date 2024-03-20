import { Plan } from '../../src/casa.js';
import { DateTime } from 'luxon';

export default () => {
  const plan = new Plan({
    arbiter: 'auto',
  });

  // #### Who is applying ####
  plan.addSequence('who-is-applying');
  plan.setRoute('who-is-applying', 'eligibility-start', (route, context) => (context.data['eligibility-start'] === undefined || !context.data['eligibility-start'].visited) && context.data['who-is-applying'].whoIsApplying === 'self');
  plan.setRoute('who-is-applying', 'cannot-apply-online', (route, context) => context.data['who-is-applying'].whoIsApplying === 'someOneElse');
  plan.setRoute('who-is-applying', 'helping-someone-apply', (route, context) => context.data['who-is-applying'].whoIsApplying === 'helpingSomeOne' && (context.data['eligibility-start'] === undefined || !context.data['eligibility-start'].visited));
  plan.setRoute('who-is-applying', 'disability-or-health-condition', (route, context) => context.data['eligibility-start'] !== undefined && context.data['eligibility-start'].visited);

  // #### Helping someone apply ####
  plan.setRoute('helping-someone-apply', 'eligibility-start');

  // #### Eligibility Health Checks ####
  plan.setRoute('eligibility-start', 'disability-or-health-condition');

  // #### Disability Health Condition ####
  plan.setRoute('disability-or-health-condition', 'not-eligible-disability-or-health-condition', (route, context) => context.data['disability-or-health-condition'].disabilityOrHealthCondition === 'no');
  plan.setRoute('disability-or-health-condition', 'state-pension-age', (route, context) => context.data['disability-or-health-condition'].disabilityOrHealthCondition === 'yes');

  // #### Eligibility Health Checks ####
  plan.setRoute('not-eligible-disability-or-health-condition', 'state-pension-age', (route, context) => context.data['not-eligible-disability-or-health-condition'].whatDoYouWantToDo === 'nsesa');

  // #### State Pension Age ####
  plan.setRoute('state-pension-age', 'national-insurance', (route, context) => context.data['state-pension-age'].statePensionAge === 'yes');
  plan.setRoute('state-pension-age', 'not-eligible-state-pension', (route, context) => context.data['state-pension-age'].statePensionAge === 'no');

  // #### National Insurance ####
  plan.setRoute('national-insurance', 'statutory-pay', (route, context) => context.data['national-insurance'].nationalInsurance === 'yes' || context.data['national-insurance'].nationalInsurance === 'notSure');
  plan.setRoute('national-insurance', 'get-national-insurance-credits', (route, context) => context.data['national-insurance'].nationalInsurance === 'no');

  // #### Get National Insurance Credits ####
  plan.addSequence('get-national-insurance-credits', 'statutory-pay');

  // #### Statutory Sick Pay check for eligibility ####
  plan.setRoute('statutory-pay', 'statutory-pay-end-date', (route, context) => context.data['statutory-pay'].statutoryPay === 'yes');
  plan.setRoute('statutory-pay', 'reason-no-sick-pay', (route, context) => context.data['statutory-pay'].statutoryPay === 'no');

  // #### Statutory Sick Pay check end date for eligibility ####
  plan.setRoute('statutory-pay-end-date', 'may-be-eligible', (route, context) => context.data['statutory-pay-end-date'].statutoryPayEndDate === 'yes');
  plan.setRoute('statutory-pay-end-date', 'not-eligible-statutory-pay', (route, context) => context.data['statutory-pay-end-date'].statutoryPayEndDate === 'no');

  // #### Reason no sick paye ####
  plan.addSequence('reason-no-sick-pay', 'may-be-eligible');

  // #### May be eligible ####
  plan.addSequence('may-be-eligible', 'name');

  // #### Name ####
  plan.setRoute('name', 'date-of-birth', (route, context) => context.data.name.firstName !== null && context.data.name.lastName !== null);

  // #### DoB ####
  plan.setRoute('date-of-birth', 'national-insurance-number', (route, context) => {
    const dob = context.data['date-of-birth'].dateOfBirth;
    if (dob.dd !== undefined && dob.mm !== undefined && dob.yyyy !== undefined) {
      return true;
    }
  });

  // #### NIN ####
  plan.setRoute('national-insurance-number', 'address', (route, context) => context.data['national-insurance-number'].nino !== undefined);

  // #### Address ####
  plan.setRoute('address', 'correspondence-address', (route, context) => {
    const { address } = context.data.address;
    if (context.data.address.correspondence === 'no' && address.address1 !== undefined && address.postcode !== undefined) {
      return true;
    }
  });
  plan.setRoute('address', 'language-preference-writing', (route, context) => {
    const { address } = context.data.address;
    if (context.data.postcode.welsh && context.data.address.correspondence === 'yes' && address.address1 !== undefined && address.postcode !== undefined) {
      return true;
    }
  });
  plan.setRoute('address', 'mobile', (route, context) => {
    const { address } = context.data.address;
    if ((context.data.postcode.welsh === undefined || !context.data.postcode.welsh) && context.data.address.correspondence === 'yes' && address.address1 !== undefined && address.postcode !== undefined) {
      return true;
    }
  });

  // #### Correspondance Address ####
  plan.setRoute('correspondence-address', 'language-preference-writing', (route, context) => {
    const { correspondenceAddress } = context.data['correspondence-address'];
    if (context.data.postcode.welsh || (context.data.postcode.welsh && correspondenceAddress.address1 !== undefined && correspondenceAddress.postcode !== undefined)) {
      return true;
    }
  });

  plan.setRoute('correspondence-address', 'mobile', (route, context) => {
    const { correspondenceAddress } = context.data['correspondence-address'];
    if (!context.data.postcode.welsh && ((context.data.postcode.welsh === undefined || !context.data.postcode.welsh) && correspondenceAddress.address1 !== undefined && correspondenceAddress.postcode !== undefined)) {
      return true;
    }
  });

  // #### Language preferences ####

  plan.addSequence('language-preference-writing', 'language-preference-speaking');
  plan.addSequence('language-preference-speaking', 'mobile');

  // #### Mobile ####
  plan.setRoute('mobile', 'email', (route, context) => {
    const { mobile } = context.data;
    if (mobile.mobile === 'yes' && mobile.number !== undefined) {
      return true;
    }
  });
  plan.setRoute('mobile', 'other-number', (route, context) => context.data.mobile.mobile === 'no');

  // #### Other Number ####
  plan.setRoute('other-number', 'email', (route, context) => {
    const otherNumber = context.data['other-number'];
    if (otherNumber.other === 'no' || otherNumber.other === 'yes' && otherNumber.number !== undefined) {
      return true;
    }
  });

  // #### Email ####
  plan.setRoute('email', 'conditions', (route, context) => {
    const { email } = context.data;
    if (email.emailProvided === 'no' || email.emailProvided === 'yes' && email.email !== undefined) {
      return true;
    }
  });


  // #################################################
  // #### -------- CONDITIONS START -------- ####
  // #################################################

  // display when limit is NOT reached and answered NOT no to another condition or no another health condition cya journey
  plan.setRoute('conditions', 'another-health-condition', (route, context) => {
    const { conditions } = context.data;
    if (
      conditions
      && conditions.conditionName
      && conditions.conditionStartDate
      && conditions.conditionStartDate.dd
      && conditions.conditionStartDate.mm
      && conditions.conditionStartDate.yyyy
    ) {
      return true;
    }
  });

  // #### Another Conditions ####
  // display when limit is NOT reached and answered NOT no to another condition
  plan.setRoute('another-health-condition', 'conditions', (route, context) => {
    const anotherHealthCondition = context.data['another-health-condition'];
    if (anotherHealthCondition && anotherHealthCondition.anotherCondition === 'yes' && anotherHealthCondition.limitReached === 'no') {
      return true;
    }
  });
  plan.setRoute('another-health-condition', 'medical-centre', (route, context) => {
    const anotherHealthCondition = context.data['another-health-condition'];
    const anotherCondition = context.data['another-condition'];
    if (anotherHealthCondition && anotherCondition?.cyaJourney !== 'yes' && (anotherHealthCondition.anotherCondition === 'no' || anotherHealthCondition.limitReached === 'yes')) {
      return true;
    }
  });
  plan.setRoute('another-health-condition', 'check-your-answers', (route, context) => {
    const anotherHealthCondition = context.data['another-health-condition'];
    const anotherCondition = context.data['another-condition'];
    if (anotherCondition?.cyaJourney === 'yes' && (anotherHealthCondition.anotherCondition === 'no' || anotherHealthCondition.limitReached === 'yes')) {
      return true;
    }
  });

  // #################################################
  // #### -------- CONDITIONS END -------- ####
  // #################################################

  // #### Medical centre ####
  plan.setRoute('medical-centre', 'live-less-than-12-months', (route, context) => {
    const medicalCentre = context.data['medical-centre'];
    if (
      medicalCentre
      && medicalCentre.name
      && medicalCentre.address
      && medicalCentre.address.address1
      && medicalCentre.address.address3
      && medicalCentre.address.postcode
      && medicalCentre.phoneNumber
    ) {
      return true;
    }
  });

  // #### Live less than 12 months ####
  plan.setRoute('live-less-than-12-months', 'sr1-report', (route, context) => context.data['live-less-than-12-months'].severeCondition === 'yes');
  plan.setRoute('live-less-than-12-months', 'hospital-inpatient', (route, context) => context.data['live-less-than-12-months'].severeCondition === 'no');

  // #### SR1 Report ####
  plan.setRoute('sr1-report', 'hospital-inpatient', (route, context) => context.data['sr1-report'] && context.data['sr1-report'].sr1Report !== null);

  // #### Hospital inpatient ####
  plan.setRoute('hospital-inpatient', 'hospital-details', (route, context) => context.data['hospital-inpatient'].hospitalInpatient === 'yes');
  plan.setRoute('hospital-inpatient', 'pregnant', (route, context) => context.data['hospital-inpatient'].hospitalInpatient === 'no');

  // #### Hospital details ####
  plan.setRoute('hospital-details', 'pregnant', (route, context) => {
    const hospitalDetails = context.data['hospital-details'];
    if (hospitalDetails.hospitalName && hospitalDetails.hospitalWard && hospitalDetails.admissionDate) {
      return true;
    }
  });

  // #### Pregnant ####
  plan.setRoute('pregnant', 'pregnant-due-date', (route, context) => context.data.pregnant.pregnant === 'yes');
  plan.setRoute('pregnant', 'doctor-declaration', (route, context) => context.data.pregnant.pregnant === 'no');

  // #### Pregnant due date ####
  plan.setRoute('pregnant-due-date', 'doctor-declaration', (route, context) => {
    const pregnantDueDate = context.data['pregnant-due-date'].dueDate;
    if (context.data.pregnant.pregnant === 'yes' && pregnantDueDate && pregnantDueDate.dd && pregnantDueDate.mm && pregnantDueDate.yyyy) {
      return true;
    }
  });

  // #### Doctor declaration ####
  plan.setRoute('doctor-declaration', 'voluntary-work', (route, context) => context.data['doctor-declaration'].docShareWithDWP === 'yes' || context.data['doctor-declaration'].docShareWithDWP === 'no');

  // #################################################
  // #### -------- VOLUNTARY WORK START -------- ####
  // #################################################

  // #### Voluntary work ####
  plan.setRoute('voluntary-work', 'voluntary-work-details', (route, context) => {
    if (context.data['voluntary-work'] !== undefined && context.data['voluntary-work'].voluntaryWork === 'yes' || context.data['voluntary-work'].other === 'yes') return true;
  });

  plan.setRoute('voluntary-work', 'employed', (route, context) => {
    const voluntaryWorkCya = context.data['voluntary-work-cya'];
    if (
      voluntaryWorkCya?.cyaJourney !== 'yes'
      && context.data['voluntary-work'] !== undefined
      && (context.data['voluntary-work'].voluntaryWork === 'no'
        || context.data['voluntary-work'].other === 'no')
    ) {
      return true
    }
  });

  plan.setRoute('voluntary-work', 'check-your-answers', (route, context) => {
    const voluntaryWorkCya = context.data['voluntary-work-cya'];
    if (voluntaryWorkCya?.cyaJourney === 'yes' && (context.data['voluntary-work'].voluntaryWork === 'no' || context.data['voluntary-work'].other === 'no')) {
      return true;
    }
  });

  // #### Voluntary work details ####
  plan.setRoute('voluntary-work-details', 'voluntary-work-role', (route, context) =>
    context.data['voluntary-work-details'].organisationName !== undefined
    && context.data['voluntary-work-details'].organisationAddress.address1 !== undefined
    && context.data['voluntary-work-details'].organisationAddress.postcode !== undefined
  );

  // #### Voluntary work role ####
  plan.setRoute('voluntary-work-role', 'voluntary-work-hours', (route, context) => {
    if (context.data['voluntary-work-role'] !== undefined) {
      return true;
    }
  });

  // #### Voluntary work hours ####
  plan.setRoute('voluntary-work-hours', 'voluntary-work', (route, context) => {
    const voluntaryWorkHours = context.data['voluntary-work-hours'];
    if (voluntaryWorkHours !== undefined && (voluntaryWorkHours.sameHours === 'no' || voluntaryWorkHours.sameHours === 'yes' && voluntaryWorkHours.hours !== undefined)) {
      return true;
    }
  });

  // #################################################
  // #### -------- VOLUNTARY WORK END -------- ####
  // #################################################

  // #################################################
  // #### -------- EMPLOYMENT START -------- ####
  // #################################################

  // #### Employed ####
  plan.setRoute('employed', 'employment-status', (route, context) => {
    const { employed } = context.data.employed ? context.data : undefined;
    if (employed !== undefined) {
      if (employed.screen === 'employed-other' && employed.other === 'yes') return true;
      else if (employed.screen === 'employed' && employed.employed === 'yes') return true;
    }
  });

  plan.setRoute('employed', 'statutory-sick-pay-recent', (route, context) => {
    const employedCya = context.data['employed-cya'];
    if (
      (employedCya?.cyaJourney !== 'yes'
        || context.data['employed-ssp'].required)
      && context.data.employed !== undefined
      && (context.data.employed.employed === 'no' || context.data.employed.other === 'no')
      && context.data['statutory-pay'].statutoryPay === 'no'
    ) {
      return true;
    }
  });

  plan.setRoute('employed', 'statutory-sick-pay-end', (route, context) => {
    const employedCya = context.data['employed-cya'];
    if (
      (employedCya?.cyaJourney !== 'yes'
        || context.data['employed-ssp'].required)
      && context.data.employed !== undefined
      && (context.data.employed.employed === 'no' || context.data.employed.other === 'no')
      && context.data['statutory-pay'].statutoryPay === 'yes'
    ) {
      return true;
    }
  });

  plan.setRoute('employed', 'check-your-answers', (route, context) => {
    const employedCya = context.data['employed-cya'];
    const { employed } = context.data.employed ? context.data : undefined;
    if (employedCya?.cyaJourney === 'yes' && (employed.employed === 'no' || employed.other === 'no')) {
      if (
        (employed.employed === 'no' || employed.other === 'no') &&
        context.data['statutory-sick-pay-recent'] !== undefined &&
        !context.data['employed-ssp'].required
      ) return true;
      else if (
        (employed.employed === 'no' || employed.other === 'no') &&
        context.data['statutory-pay'].statutoryPay === 'yes' &&
        context.data['statutory-pay-end-date'].statutoryPayEndDate === 'yes' &&
        !context.data['employed-ssp'].required
      ) return true;
    }
  });

  // ### statutory-sick-pay-end ###
  plan.setRoute('statutory-sick-pay-end', 'statutory-pay-other');

  // #### Employed status ####
  plan.setRoute('employment-status', 'employment-details', (route, context) => context.data['employment-status'] !== undefined && context.data['employment-status'] && context.data['employment-status'].workTypes && context.data['employment-status'].workTypes.length && !context.data['employment-status'].workTypes.includes('selfEmployed'));
  plan.setRoute('employment-status', 'self-employment-details', (route, context) => {
    if (context.data['employment-status'] !== undefined && context.data['employment-status'] && context.data['employment-status'].workTypes && context.data['employment-status'].workTypes.length) {
      if (context.data['employment-status'].workTypes.includes('selfEmployed')) {
        return true;
      }
    }
  });

  // #### Self Employed details ####
  plan.setRoute('self-employment-details', 'employment-off-sick', (route, context) => context.data['self-employment-details'] !== undefined);

  // #### Employed details ####
  plan.setRoute('employment-details', 'employment-off-sick', (route, context) => context.data['employment-details'] !== undefined);

  // #### Employment off sick ####
  plan.setRoute('employment-off-sick', 'employment-last-work', (route, context) => context.data['employment-off-sick'] !== undefined && context.data['employment-off-sick'].offSick === 'yes');
  plan.setRoute('employment-off-sick', 'employment-hours', (route, context) => context.data['employment-off-sick'] !== undefined && context.data['employment-off-sick'].offSick === 'no');

  // #### Employment last work ####
  plan.setRoute('employment-last-work', 'employed', (route, context) => {
    const employmentLastWork = context.data['employment-last-work']?.lastWorkedDate;
    if (employmentLastWork !== undefined && employmentLastWork.dd !== undefined && employmentLastWork.mm !== undefined && employmentLastWork.yyyy !== undefined) {
      return true;
    }
  });

  // Not off sick from your job route
  // #### Employment hours ####
  plan.setRoute('employment-hours', 'employment-pay-frequency-samehours', (route, context) => context.data['employment-hours'] !== undefined && context.data['employment-hours'].sameHours === 'yes' && context.data['employment-hours'].hours !== undefined && context.data['employment-hours'].hours !== '0');
  plan.setRoute('employment-hours', 'employment-pay-frequency-other', (route, context) => context.data['employment-hours'] !== undefined && (context.data['employment-hours'].sameHours === 'no' || (context.data['employment-hours'].sameHours === 'yes' && context.data['employment-hours'].hours !== undefined && context.data['employment-hours'].hours === '0')));

  // #### Employment pay frequency ####
  plan.setRoute('employment-pay-frequency-other', 'employment-support', (route, context) => context.data['employment-pay-frequency-other'] !== undefined && context.data['employment-pay-frequency-other'].frequency !== undefined && context.data['employment-pay-frequency-other'].netPay !== undefined);
  plan.setRoute('employment-pay-frequency-samehours', 'employment-support', (route, context) => context.data['employment-pay-frequency-samehours'] !== undefined && context.data['employment-pay-frequency-samehours'].frequency !== undefined && context.data['employment-pay-frequency-samehours'].netPay !== undefined);

  // #### Employment support ####
  plan.setRoute('employment-support', 'employment-expenses', (route, context) => context.data['employment-support'] !== undefined && context.data['employment-support'].support !== undefined);

  // #### Employment expenses ####
  plan.setRoute('employment-expenses', 'employment-expenses-details', (route, context) => context.data['employment-expenses'] !== undefined && context.data['employment-expenses'].expenses === 'yes');
  plan.setRoute('employment-expenses', 'employed', (route, context) => {
    if (context.data['employment-expenses'] !== undefined && context.data['employment-expenses'].expenses === 'no') {
      context.data.employed.journeyComplete = context.data.employed.journeyComplete !== undefined ? context.data.employed.journeyComplete : true;
      return true;
    }
  });

  // #### Employment expenses details ####
  plan.setRoute('employment-expenses-details', 'employed', (route, context) => {
    if (context.data['employment-expenses-details'] !== undefined && context.data['employment-expenses-details'].expensesDetails !== undefined) {
      context.data.employed.journeyComplete = context.data.employed.journeyComplete !== undefined ? context.data.employed.journeyComplete : true;
      return true;
    }
  });

  // #################################################
  // #### -------- EMPLOYMENT END -------- ####
  // #################################################

  // #### Statutory Sick Pay end date ####
  plan.setRoute('statutory-sick-pay-end', 'statutory-pay-other', function (route, context) {
    const { sspEndDate } = context.data['statutory-sick-pay-end'] ? context.data['statutory-sick-pay-end'] : false;
    if (sspEndDate && sspEndDate.dd !== undefined && sspEndDate.mm !== undefined && sspEndDate.yyyy !== undefined) {
      return true;
    }
    return false;
  });

  // #### Statutory Sick Pay Recent ####

  plan.setRoute('statutory-sick-pay-recent', 'statutory-pay-other', (route, context) => {
    if (
      (context.data['statutory-sick-pay-recent'] !== undefined &&
        context.data['statutory-sick-pay-recent'].sspRecent !== undefined &&
        context.data['statutory-sick-pay-recent'].sspRecent === 'no') &&
      (context.data['claim-start-date-cya']?.cyaJourney !== 'yes' && context.data['statutory-pay-cya']?.cyaJourney !== 'yes')
    ) return true;
  });

  plan.setRoute('statutory-sick-pay-recent', 'claim-start-date', (route, context) =>
    context.data['statutory-sick-pay-recent'] !== undefined &&
    context.data['statutory-sick-pay-recent'].sspRecent !== undefined &&
    context.data['statutory-sick-pay-recent'].sspRecent === 'no' &&
    (context.data['claim-start-date-cya']?.cyaJourney === 'yes' || context.data['statutory-pay-cya']?.cyaJourney === 'yes')
  );

  plan.setRoute('statutory-sick-pay-recent', 'statutory-sick-pay-end', (route, context) =>
    context.data['statutory-sick-pay-recent'] !== undefined &&
    context.data['statutory-sick-pay-recent'].sspRecent !== undefined &&
    context.data['statutory-sick-pay-recent'].sspRecent === 'yes'
  );

  // #### Statutory Sick Pay other ####
  plan.setRoute('statutory-pay-other', 'universal-credit', (route, context) => {
    const claimStartDateCya = context.data['claim-start-date-cya'] ? context.data['claim-start-date-cya'].cyaJourney : false;
    const statutoryPayCya = context.data['statutory-pay-cya'] ? context.data['statutory-pay-cya'].cyaJourney : false;

    if (
      context.data['statutory-pay-other']
      && context.data['statutory-pay-other'].statutoryPayOther !== undefined
      || (claimStartDateCya !== 'yes' || statutoryPayCya !== 'yes')
    ) return true;
  }
  );

  // #### Universal Credit  #####

  plan.setRoute('universal-credit', 'claim-start-date', function (route, context) {
    if (
      (
        (context.data['claim-start-date-after-statutory-sick-pay'] === undefined || context.data['claim-start-date-after-statutory-sick-pay'].claimStartDateAfterSsp !== 'yes')
        || (context.data['late-claim'] !== undefined && context.data['late-claim'].lateClaim === 'no')
      )
      && (context.data['statutory-sick-pay-recent'] && context.data['statutory-sick-pay-recent'].sspRecent === 'no')
    ) return true;
  });

  plan.setRoute('universal-credit', 'claim-start-date-after-statutory-sick-pay', (route, context) => {
    if (
      context.data['statutory-sick-pay-end'] !== undefined
      && context.data['statutory-sick-pay-end'].sspEndDate !== undefined
    ) return true;
  });

  // #### Claim from start date when statutory sick pay previously entered ####
  plan.setRoute('claim-start-date-after-statutory-sick-pay', 'claim-start-date', (route, context) =>
    context.data['claim-start-date-after-statutory-sick-pay'] !== undefined && context.data['claim-start-date-after-statutory-sick-pay'].claimStartDateAfterSsp === 'no'
  );

  plan.setRoute('claim-start-date-after-statutory-sick-pay', 'claim-end-date', (route, context) => context.data['claim-start-date-after-statutory-sick-pay'] !== undefined && context.data['claim-start-date-after-statutory-sick-pay'].claimStartDateAfterSsp === 'yes');

  // #### Claim start date without statutory sick pay ####
  plan.setRoute('claim-start-date', 'claim-end-date', function (route, context) {
    if (context.data['claim-start-date'] === undefined) return false;
    const claimStartDateInput = context.data['claim-start-date'].claimStartDate ? context.data['claim-start-date'].claimStartDate : false;
    if (claimStartDateInput) {
      const { dd, mm, yyyy } = claimStartDateInput;
      const claimStartDt = DateTime.fromISO(`${yyyy}-${('0' + mm).slice(-2)}-${('0' + dd).slice(-2)}`).endOf('day');
      const dateThreeMonthAgo = DateTime.now().minus({ months: 3 }).startOf('day');
      return claimStartDt > dateThreeMonthAgo;
    }
    else return false;
  });

  plan.setRoute('claim-start-date', 'late-claim', function (route, context) {
    if (context.data['claim-start-date'] === undefined) return false;
    const claimStartDateInput = context.data['claim-start-date'].claimStartDate ? context.data['claim-start-date'].claimStartDate : false;
    if (claimStartDateInput) {
      const { dd, mm, yyyy } = claimStartDateInput;
      const claimStartDt = DateTime.fromISO(`${yyyy}-${('0' + mm).slice(-2)}-${('0' + dd).slice(-2)}`).endOf('day');
      const dateThreeMonthAgo = DateTime.now().minus({ months: 3 }).startOf('day');
      return claimStartDt < dateThreeMonthAgo;
    }
    else return false;
  });

  // #### Late claim ####
  plan.setRoute('late-claim', 'claim-end-date', (route, context) => context.data['late-claim'] && context.data['late-claim'].lateClaim === 'yes');
  plan.setRoute('late-claim', 'claim-start-date', (route, context) => context.data['late-claim'] && context.data['late-claim'].lateClaim === 'no');

  // #### Claim end date ####
  plan.setRoute('claim-end-date', 'work-overseas', (route, context) =>
    context.data['claim-end-date'] !== undefined &&
    context.data['claim-end-date'].claimEnd === 'no' ||
    (context.data['claim-end-date'] !== undefined && context.data['claim-end-date'].claimEnd === 'yes' && context.data['claim-end-date'].claimEndDate !== undefined)
  );

  // #### Work overseas ####
  plan.setRoute('work-overseas', 'military-overseas', (route, context) => context.data['work-overseas'] && context.data['work-overseas'].workOverseas !== undefined);

  // #### Military overseas ####
  plan.setRoute('military-overseas', 'pension', (route, context) => context.data['military-overseas'] && context.data['military-overseas'].militaryOverseas !== undefined);

  // #### Pension ####
  plan.setRoute('pension', 'pension-inherit', (route, context) => context.data.pension && context.data.pension.pension === 'yes');
  plan.setRoute('pension', 'insurance', (route, context) => context.data.pension && context.data.pension.pension !== 'yes');

  // #### Pension inherit ####
  plan.setRoute('pension-inherit', 'insurance', (route, context) => context.data.pension && context.data.pension.pension === 'yes');

  // #### Insurance ####
  plan.setRoute('insurance', 'bank-details', (route, context) => context.data.insurance && context.data.insurance.insurance);

  // #### Bank details ####
  plan.setRoute('bank-details', 'consent-outcome', (route, context) => {
    const bankDetails = context.data['bank-details'];
    if (
      bankDetails !== undefined
      && bankDetails.accountName !== undefined
      && bankDetails.bankName !== undefined
      && bankDetails.sortCode !== undefined
      && bankDetails.accountNumber !== undefined
    ) {
      return true;
    }
  });

  // #### Consent outcome ####
  plan.setRoute('consent-outcome', 'check-your-answers');

  // #### Check your answers ####
  plan.setRoute('check-your-answers', 'declaration');

  // #### Declaration ####
  plan.setRoute('declaration', 'complete');

  return plan;
};
