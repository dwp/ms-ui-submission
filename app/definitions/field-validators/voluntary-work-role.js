const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Voluntary work role validator');

module.exports = {
  role: SimpleField([
    rules.required.bind({
      errorMsg: 'voluntary-work-role:role.errors.required',
    }),
    rules.strlen.bind({
      max: 10000,
      errorMsgMax: 'voluntary-work-role:role.errors.maxLength',
    }),
  ]),
};
