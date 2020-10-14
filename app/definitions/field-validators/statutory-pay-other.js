const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Statutory pay other validator');

module.exports = {
  statutoryPayOther: SimpleField([
    rules.required.bind({
      errorMsg: 'statutory-pay-other:statutoryPayOther.errors.required',
    }),
    rules.inArray.bind({
      source: ['maternity', 'paternity', 'adoption', 'sharedParental', 'none'],
      errorMsg: 'statutory-pay-other:statutoryPayOther.errors.required',
    }),
  ]),
};
