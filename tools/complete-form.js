/**
 * This function can be called with a parameter matching the variables defined at the
 * start of the 'example' function the argument takes the form variable=value.
 * The value is 'yes', 'true' or '1' for true and 'no', 'false' or '0' for false.
 * call the script with npm run fill for the default values.
 * call with `npm run script all=0` to set all the false
 * call with `npm run script all=1` to set all the true
 * call with `npm run script all=1 pregnant=0` to set all the true but set pregnant to false.
 */
/* eslint-disable */
const {Builder, By, Key, until} = require('selenium-webdriver');
const faker = require('faker');
const moment = require('moment');

const args = process.argv.slice(2)
  .filter(a => a.split('=').length === 2)
  .reduce((acc, val) => {
    val = val.split('=');
    if (val.length === 2) {
      acc[val[0]] = val[1] === 'yes' || val[1] === 'true' || val[1] === '1';
      return acc;
    }
  }, {});

(async function example() {
  // if the var has a value, use that, otherwise check for all
  const localenv = args.localenv !== undefined ? args.localenv : args.all !== undefined ? args.all : true;
  const coronavirus = args.coronavirus !== undefined ? args.coronavirus : args.all !== undefined ? args.all : false;
  const highrisk = args.highrisk !== undefined ? args.highrisk : args.all !== undefined ? args.all : false;
  const pregnant = args.pregnant !== undefined ? args.pregnant : args.all !== undefined ? args.all : false;
  const terminal = args.terminal !== undefined ? args.terminal : args.all !== undefined ? args.all : false;
  const inPatient = args.inPatient !== undefined ? args.inPatient : args.all !== undefined ? args.all : true;
  const doctorDeclaration = args.doctorDeclaration !== undefined ? args.doctorDeclaration : args.all !== undefined ? args.all : true;
  const consentOutcome = args.consentOutcome !== undefined ? args.consentOutcome : args.all !== undefined ? args.all : true;
  const voluntary = args.voluntary !== undefined ? args.voluntary : args.all !== undefined ? args.all : true;
  const voluntaryJobs = 3;
  const employed = args.employed !== undefined ? args.employed : args.all !== undefined ? args.all : true;
  const offSick = args.offSick !== undefined ? args.offSick : args.all !== undefined ? args.all : false;
  const sameHours = args.sameHours !== undefined ? args.sameHours : args.all !== undefined ? args.all : true;
  const empExpenses = args.empExpenses !== undefined ? args.empExpenses : args.all !== undefined ? args.all : true;
  const sspRecent = args.sspRecent !== undefined ? args.sspRecent : args.all !== undefined ? args.all : false;
  const statutoryPayments = args.statutoryPayments !== undefined ? args.statutoryPayments : args.all !== undefined ? args.all : false;
  const claimEndDate = args.claimEndDate !== undefined ? args.claimEndDate : args.all !== undefined ? args.all : true;
  const ssp = args.ssp !== undefined ? args.ssp : args.all !== undefined ? args.all : true;
  const workOverseas = args.workOverseas !== undefined ? args.workOverseas : args.all !== undefined ? args.all : true;
  const militaryOverseas = args.militaryOverseas !== undefined ? args.militaryOverseas : args.all !== undefined ? args.all : true;
  const pension = args.pension !== undefined ? args.pension : args.all !== undefined ? args.all : true;
  const pensionDeductions = args.pensionDeductions !== undefined ? args.pensionDeductions : args.all !== undefined ? args.all : false;
  const insurance = args.insurance !== undefined ? args.insurance : args.all !== undefined ? args.all : true;
  const mobile = args.mobile !== undefined ? args.mobile : args.all !== undefined ? args.all : true;
  const otherNumber = args.otherNumber !== undefined ? args.otherNumber : args.all !== undefined ? args.all : true;
  const conditions = 3;
  const pensionDeductionsDetails = 3;

  const blankPension = args.blankPension !== undefined ? args.blankPension : false;
  const blankInsurance = args.blankInsurance !== undefined ? args.blankInsurance : false;

  let chrome = require('selenium-webdriver/chrome');
  let driver = await new Builder().forBrowser('chrome').build();

  var baseUrl = 'http://localhost:3000/'; //local
  if (!localenv) {
    baseUrl = 'https://esao-dev-blue.sdx.health-dev.dwpcloud.uk/'; //dev
  }

  try {
    await driver.get(baseUrl.concat('coronavirus'));

    if (coronavirus) {
      await driver.findElement(By.id('f-coronavirusReasonForClaim')).click();
      await driver.findElement(By.id('continue-button')).click();
    } else {
      await driver.findElement(By.id('f-coronavirusReasonForClaim-2')).click();
      await driver.findElement(By.id('continue-button')).click();
      await driver.findElement(By.id('f-disabilityOrHealthCondition')).click();
      await driver.findElement(By.id('continue-button')).click();
    }

    await driver.findElement(By.id('f-statePensionAge')).click();
    await driver.findElement(By.id('continue-button')).click();

    await driver.findElement(By.id('f-nationalInsurance')).click();
    await driver.findElement(By.id('continue-button')).click();

    if (ssp) {
      await driver.findElement(By.id('f-statutoryPay')).click();
      await driver.findElement(By.id('continue-button')).click();

      await driver.findElement(By.id('f-statutoryPayEndDate')).click();
      await driver.findElement(By.id('continue-button')).click();
    } else {
      await driver.findElement(By.id('f-statutoryPay-2')).click();
      await driver.findElement(By.id('continue-button')).click();
    }



    await driver.findElement(By.id('f-severeDisabilityPremium-2')).click();
    await driver.findElement(By.id('continue-button')).click();

    await driver.get(baseUrl.concat('name'));

    await driver.findElement(By.name('firstName')).sendKeys(faker.name.firstName());
    await driver.findElement(By.name('lastName')).sendKeys(faker.name.lastName());
    await driver.findElement(By.id('continue-button')).click();

    await driver.findElement(By.name('dateOfBirth[dd]')).sendKeys('7');
    await driver.findElement(By.name('dateOfBirth[mm]')).sendKeys('4');
    await driver.findElement(By.name('dateOfBirth[yyyy]')).sendKeys('1981');
    await driver.findElement(By.id('continue-button')).click();

    await driver.findElement(By.name('nino')).sendKeys('AA370773A');
    await driver.findElement(By.id('continue-button')).click();

    await driver.findElement(By.name('address[address1]')).sendKeys(faker.address.streetAddress());
    await driver.findElement(By.name('address[postcode]')).sendKeys('LS1 1DJ');
    await driver.findElement(By.id('f-correspondence')).click();
    await driver.findElement(By.id('continue-button')).click();

    if (mobile) {
      await driver.findElement(By.id('f-mobile')).click();
      await driver.findElement(By.name('number')).sendKeys(faker.phone.phoneNumberFormat(1));
      await driver.findElement(By.id('continue-button')).click();
    } else {
      await driver.findElement(By.id('f-mobile-2')).click();
      await driver.findElement(By.id('continue-button')).click();
      if (otherNumber) {
        await driver.findElement(By.id('f-other')).click();
        await driver.findElement(By.name('number')).sendKeys(faker.phone.phoneNumberFormat(1));
        await driver.findElement(By.id('continue-button')).click();
      } else {
        await driver.findElement(By.id('f-other-2')).click();
        await driver.findElement(By.id('continue-button')).click();
      }
    }

    if(coronavirus) {
      if(highrisk) {
        await driver.findElement(By.id('f-coronavirusReasonForClaim')).click();
        await driver.findElement(By.id('continue-button')).click();
        await driver.findElement(By.id('f-coronavirusShielding')).click();
        await driver.findElement(By.id('continue-button')).click();
        await driver.findElement(By.name('coronavirusDate[dd]')).sendKeys('4');
        await driver.findElement(By.name('coronavirusDate[mm]')).sendKeys('4');
        await driver.findElement(By.name('coronavirusDate[yyyy]')).sendKeys('2020');
        await driver.findElement(By.id('continue-button')).click();
      } else {
        await driver.findElement(By.id('f-coronavirusReasonForClaim-2')).click();
        await driver.findElement(By.id('continue-button')).click();
        await driver.findElement(By.name('coronavirusDate[dd]')).sendKeys('4');
        await driver.findElement(By.name('coronavirusDate[mm]')).sendKeys('4');
        await driver.findElement(By.name('coronavirusDate[yyyy]')).sendKeys('2020');
        await driver.findElement(By.id('continue-button')).click();
        await driver.findElement(By.id('f-coronavirusOtherCondition')).click();
        await driver.findElement(By.id('continue-button')).click();
      }
    }

    for(let i = 0; i < conditions; i++){
      await driver.findElement(By.name(`conditions[${i}][name]`)).sendKeys(faker.hacker.adjective() + ' ' + faker.hacker.noun());
      await driver.findElement(By.name(`conditions[${i}][conditionStartDate][dd]`)).sendKeys('1');
      await driver.findElement(By.name(`conditions[${i}][conditionStartDate][mm]`)).sendKeys('2');
      await driver.findElement(By.name(`conditions[${i}][conditionStartDate][yyyy]`)).sendKeys('2003');
      if (i < 11) await driver.findElement(By.id('add-another')).click();
    }
    await driver.findElement(By.id('continue-button')).click();

    await driver.findElement(By.name('doctor')).sendKeys('Dr. ' + faker.name.firstName() + ' ' + faker.name.lastName());
    await driver.findElement(By.name('name')).sendKeys(faker.company.companyName());
    await driver.findElement(By.name('phoneNumber')).sendKeys(faker.phone.phoneNumberFormat(1));
    await driver.findElement(By.name('address[address1]')).sendKeys(faker.address.streetAddress());
    await driver.findElement(By.name('address[address3]')).sendKeys(faker.address.city());
    await driver.findElement(By.name('address[postcode]')).sendKeys('LS1 1DJ');
    await driver.findElement(By.id('continue-button')).click();

    if (terminal) {
      await driver.wait(until.elementLocated(By.id('f-severeCondition'))).click();
      await driver.findElement(By.id('continue-button')).click();

      await driver.findElement(By.id('f-ds1500Report')).click();
      await driver.findElement(By.id('continue-button')).click();
    } else {
      await driver.wait(until.elementLocated(By.id('f-severeCondition-2'))).click();
      await driver.findElement(By.id('continue-button')).click();
    }

    if (inPatient) {
      await driver.findElement(By.id('f-hospitalInpatient')).click();
      await driver.findElement(By.name('hospitalName')).sendKeys(faker.company.companyName());
      await driver.findElement(By.name('hospitalWard')).sendKeys(faker.company.companyName());
      const admissionDate = moment().subtract(3, 'months');
      await driver.findElement(By.name('admissionDate[dd]')).sendKeys(admissionDate.date().toString());
      await driver.findElement(By.name('admissionDate[mm]')).sendKeys((admissionDate.month() + 1).toString());
      await driver.findElement(By.name('admissionDate[yyyy]')).sendKeys(admissionDate.year());
    } else {
      await driver.findElement(By.id('f-hospitalInpatient-2')).click();
    }

    await driver.findElement(By.id('continue-button')).click();

    if (pregnant) {
      await driver.findElement(By.id('f-pregnant')).click();
      const dueDate = moment().add(3, 'months');
      await driver.findElement(By.name('dueDate[dd]')).sendKeys(dueDate.date().toString());
      await driver.findElement(By.name('dueDate[mm]')).sendKeys((dueDate.month() + 1).toString());
      await driver.findElement(By.name('dueDate[yyyy]')).sendKeys(dueDate.year());
    } else {
      await driver.findElement(By.id('f-pregnant-2')).click();
    }

    await driver.findElement(By.id('continue-button')).click();

    if (doctorDeclaration) {
      await driver.findElement(By.id('f-docShareWithDWP')).click();
    } else {
      await driver.findElement(By.id('f-docShareWithDWP-2')).click();
    }
    await driver.findElement(By.id('continue-button')).click();

    if (voluntary) {
      await driver.findElement(By.id('f-voluntaryWork')).click();
      await driver.findElement(By.id('continue-button')).click();

      for(let i = 0; i < voluntaryJobs; i++){
        await driver.findElement(By.name('organisationName')).sendKeys(faker.company.companyName());
        await driver.findElement(By.name('organisationAddress[address1]')).sendKeys(faker.address.streetAddress());
        await driver.findElement(By.name('organisationAddress[postcode]')).sendKeys('LS1 1DJ');
        await driver.findElement(By.id('continue-button')).click();
        await driver.wait(until.elementLocated(By.name('role'))).sendKeys(faker.lorem.paragraph());
        await driver.findElement(By.id('continue-button')).click();
        if (sameHours) {
          await driver.wait(until.elementLocated(By.id('f-sameHours'))).click();
          await driver.findElement(By.id('f-sameHours')).click();
          await driver.findElement(By.name('hours')).sendKeys('1');
        } else {
          await driver.findElement(By.id('f-sameHours-2')).click();
        }
        await driver.findElement(By.id('continue-button')).click();

        if(i !== voluntaryJobs - 1) {
          await driver.findElement(By.id('f-other')).click();
          await driver.findElement(By.id('continue-button')).click();
        } else {
          await driver.findElement(By.id('f-other-2')).click();
          await driver.findElement(By.id('continue-button')).click();
        }
      }
    } else {
      await driver.findElement(By.id('f-voluntaryWork-2')).click();
      await driver.findElement(By.id('continue-button')).click();
    }

    if (employed) {
      await driver.findElement(By.id('f-employed')).click();
      await driver.findElement(By.id('continue-button')).click();

      await driver.findElement(By.name('jobTitle')).sendKeys(faker.name.jobTitle());
      await driver.findElement(By.name('employerName')).sendKeys(faker.company.companyName());
      await driver.findElement(By.name('employerTel')).sendKeys(faker.phone.phoneNumberFormat(1));
      await driver.findElement(By.name('employerAddress[address1]')).sendKeys(faker.address.streetAddress());
      await driver.findElement(By.name('employerAddress[address3]')).sendKeys(faker.address.city());
      await driver.findElement(By.name('employerAddress[postcode]')).sendKeys('LS1 1DJ');
      await driver.findElement(By.id('continue-button')).click();

      if(offSick) {
        await driver.findElement(By.id('f-offSick')).click();
        await driver.findElement(By.id('continue-button')).click();
        const lastWorkedDate = moment().subtract(3, 'weeks');
        await driver.findElement(By.name('lastWorkedDate[dd]')).sendKeys(lastWorkedDate.date().toString());
        await driver.findElement(By.name('lastWorkedDate[mm]')).sendKeys((lastWorkedDate.month() + 1).toString());
        await driver.findElement(By.name('lastWorkedDate[yyyy]')).sendKeys(lastWorkedDate.year());
        await driver.findElement(By.id('continue-button')).click();
      } else {
        await driver.findElement(By.id('f-offSick-2')).click();
        await driver.findElement(By.id('continue-button')).click();
      }

      await driver.findElement(By.id('f-workTypes')).click();
      await driver.findElement(By.id('f-workTypes-3')).click();
      await driver.findElement(By.id('continue-button')).click();
      if(!offSick) {
        if (sameHours) {
          await driver.findElement(By.id('f-sameHours')).click();
          await driver.findElement(By.name('hours')).sendKeys('12');
        } else {
          await driver.findElement(By.id('f-sameHours-2')).click();
        }
        await driver.findElement(By.id('continue-button')).click();

        await driver.findElement(By.id('f-frequency-4')).click();
        await driver.findElement(By.name('netPay')).sendKeys('1234');
        await driver.findElement(By.id('continue-button')).click();

        await driver.findElement(By.id('f-support')).click();
        await driver.findElement(By.id('continue-button')).click();

        if (empExpenses) {
          await driver.findElement(By.id('f-expenses')).click();
          await driver.findElement(By.id('continue-button')).click();

          await driver.findElement(By.name('expensesDetails')).sendKeys(faker.lorem.paragraph());
          await driver.findElement(By.id('continue-button')).click();

        } else {
          await driver.findElement(By.id('f-expenses-2')).click();
          await driver.findElement(By.id('continue-button')).click();
        }
      }

      await driver.findElement(By.id('f-other-2')).click();
      await driver.findElement(By.id('continue-button')).click();

      if (ssp) {

        const sspEndDate = moment().add(3, 'weeks');
        await driver.findElement(By.name('sspEndDate[dd]')).sendKeys(sspEndDate.date().toString());
        await driver.findElement(By.name('sspEndDate[mm]')).sendKeys((sspEndDate.month() + 1).toString());
        await driver.findElement(By.name('sspEndDate[yyyy]')).sendKeys(sspEndDate.year());
        await driver.findElement(By.id('continue-button')).click();

      } else {

        await driver.findElement(By.id('f-sspRecent')).click();
        await driver.findElement(By.id('continue-button')).click();

        const sspRecentEndDate = moment().subtract(1, 'weeks');
        await driver.findElement(By.name('sspRecentEndDate[dd]')).sendKeys(sspRecentEndDate.date().toString());
        await driver.findElement(By.name('sspRecentEndDate[mm]')).sendKeys((sspRecentEndDate.month() + 1).toString());
        await driver.findElement(By.name('sspRecentEndDate[yyyy]')).sendKeys(sspRecentEndDate.year());
        await driver.findElement(By.id('continue-button')).click();
      }

    } else {
      await driver.findElement(By.id('f-employed-2')).click();
      await driver.findElement(By.id('continue-button')).click();

      if (sspRecent) {
        await driver.findElement(By.id('f-sspRecent')).click();
        await driver.findElement(By.id('continue-button')).click();

        const sspRecentEndDate = moment().subtract(1, 'weeks');
        await driver.findElement(By.name('sspRecentEndDate[dd]')).sendKeys(sspRecentEndDate.date().toString());
        await driver.findElement(By.name('sspRecentEndDate[mm]')).sendKeys((sspRecentEndDate.month() + 1).toString());
        await driver.findElement(By.name('sspRecentEndDate[yyyy]')).sendKeys(sspRecentEndDate.year());
        await driver.findElement(By.id('continue-button')).click();
      } else {
        await driver.findElement(By.id('f-sspRecent-2')).click();
        await driver.findElement(By.id('continue-button')).click();
      }
    }
    if (statutoryPayments) {
      await driver.findElement(By.id('f-statutoryPayOther')).click();
    } else {
      await driver.findElement(By.id('f-statutoryPayOther-6')).click();
    }

    await driver.findElement(By.id('continue-button')).click();

    await driver.findElement(By.id('f-universalCredit')).click();
    await driver.findElement(By.id('continue-button')).click();

    const claimDate = moment().subtract(3, 'week');
    await driver.findElement(By.name('claimStartDate[dd]')).sendKeys(claimDate.date().toString());
    await driver.findElement(By.name('claimStartDate[mm]')).sendKeys((claimDate.month() + 1).toString());
    await driver.findElement(By.name('claimStartDate[yyyy]')).sendKeys(claimDate.year().toString());
    await driver.findElement(By.id('continue-button')).click();

    if (claimEndDate) {
      await driver.findElement(By.id('f-claimEnd')).click();
      const returnToWorkDate = moment().add(1, 'month');
      await driver.findElement(By.name('claimEndDate[dd]')).sendKeys(returnToWorkDate.date().toString());
      await driver.findElement(By.name('claimEndDate[mm]')).sendKeys((returnToWorkDate.month() + 1).toString());
      await driver.findElement(By.name('claimEndDate[yyyy]')).sendKeys(returnToWorkDate.year());
    } else {
      await driver.findElement(By.id('f-claimEnd-2')).click();
    }
    await driver.findElement(By.id('continue-button')).click();

    if (workOverseas) {
      await driver.findElement(By.id('f-workOverseas')).click();
    } else {
      await driver.findElement(By.id('f-workOverseas-2')).click();
    }
    await driver.findElement(By.id('continue-button')).click();

    if (militaryOverseas) {
      await driver.findElement(By.id('f-militaryOverseas')).click();
    } else {
      await driver.findElement(By.id('f-militaryOverseas-2')).click();
    }
    await driver.findElement(By.id('continue-button')).click();

    if (pension) {
      await driver.findElement(By.id('f-pension')).click();
      await driver.findElement(By.id('continue-button')).click();
    } else {
      await driver.findElement(By.id('f-pension-2')).click();
      await driver.findElement(By.id('continue-button')).click();
    }
    
    if (insurance) {
      await driver.findElement(By.id('f-insurance')).click();
      await driver.findElement(By.id('continue-button')).click();
    } else {
      await driver.findElement(By.id('f-insurance-2')).click();
      await driver.findElement(By.id('continue-button')).click();
    }

    await driver.findElement(By.name('accountName')).sendKeys(faker.name.firstName() + ' ' + faker.name.lastName());
    await driver.findElement(By.name('bankName')).sendKeys(faker.company.companyName());
    await driver.findElement(By.name('sortCode')).sendKeys('000000');
    await driver.findElement(By.name('accountNumber')).sendKeys('00000000');
    await driver.findElement(By.id('continue-button')).click();


    if (consentOutcome) {
      await driver.findElement(By.id('f-dwpShareWithDoc')).click();
    } else {
      await driver.findElement(By.id('f-dwpShareWithDoc-2')).click();
    }
    await driver.findElement(By.id('continue-button')).click();
  } finally {
    // await driver.quit();
  }
})();
