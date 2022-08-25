/**
 * This script automates the calling of complete-form.js with all the journey arguments.
 * An array of arguments has been defined below.
 *
 * The script has the following parameters:
 * ENDPOINT - The endpoint to target the complete-form.js invocation
 * SUBMITCLAIM - Enables completing the declaration and submitting claims
 */
const util = require('util');
const { exec } = require('child_process');

const { ENDPOINT = 'http://localhost:3000/', SUBMITCLAIM = 'false' } = process.env;

const execAsync = util.promisify(exec);

/**
  * This function invokes complete-form.js with the passed arguments.
  * A quick and dirty way of testing various journeys.
  *
  * @async
  * @param {string[]} argumentList - An array of string arguments for complete-form.js
  * @param {string} endpoint - The endpoint to call
  * @param {('true'|'false')} submitClaim - Pass either 'true' or 'false' as a string
  * to enable complete the declaration and submit claim.
  * @return {undefined}
  *
  * @example
  *
  *     callCompleteForm(['all=true','coronavirus=true'],'http://localhost:3000/', 'true')
  */
async function callCompleteForm(argumentList, endpoint, submitClaim) {
  const argument = argumentList.join(' ');
  const output = await execAsync(`ENDPOINT=${endpoint} npm run fill submitClaim=${submitClaim} ${argument}`);
  console.log(output);
}

const argumentList = [
  'all=true',
  'pregnant=true',
  'terminal=true',
  'inPatient=true',
  'consentOutcome=true',
  'voluntary=true',
  'employed=true',
  'offSick=true',
  'sameHours=true',
  'sspRecent=true',
  'claimStartDateAfterSsp=true',
  'statutoryPayments=true',
  'claimEndDate=true',
  'ssp=true',
  'workOverseas=true',
  'pension=true',
  'insurance=true',
  'mobile=true',
  'otherNumber=true',
  'email=true',
];

callCompleteForm(argumentList, ENDPOINT, SUBMITCLAIM);
