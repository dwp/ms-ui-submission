const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Coronavirus reason for claim validator');

module.exports = {
  coronavirusReasonForClaim: SimpleField([
    rules.required.bind({
      errorMsg: 'coronavirus-reason-for-claim:coronavirusReasonForClaim.errors.required',
    }),
  ]),
  otherReasonDetail: SimpleField([
    rules.required.bind({
      errorMsg: 'coronavirus-reason-for-claim:coronavirusReasonForClaim.otherReason.errors.required',
    }),
    rules.strlen.bind({
      max: 500,
      errorMsgMax: 'coronavirus-reason-for-claim:coronavirusReasonForClaim.otherReason.errors.length',
    }),
  ], (pageData) => pageData.coronavirusReasonForClaim === 'other'),
  highRiskDesc: SimpleField([
    rules.required.bind({
      errorMsg: 'coronavirus-reason-for-claim:coronavirusReasonForClaim.errors.required',
    }),
  ]),
  selfIsolationSymptomsDesc: SimpleField([
    rules.required.bind({
      errorMsg: 'coronavirus-reason-for-claim:coronavirusReasonForClaim.errors.required',
    }),
  ]),
  selfIsolationContactDesc: SimpleField([
    rules.required.bind({
      errorMsg: 'coronavirus-reason-for-claim:coronavirusReasonForClaim.errors.required',
    }),
  ]),
};
