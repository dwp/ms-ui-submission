const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Remove function validator');

module.exports = {
  remove: SimpleField([
    rules.required.bind({
      inArray: {
        source: ['yes', 'no'],
        errorMsg: 'remove:remove.errors.required',
      },
      errorMsg: 'remove:remove.errors.required',
    }),
  ]),
};
