const { SimpleField, rules } = require('@dwp/govuk-casa/lib/Validation');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Nino validator');

module.exports = {
  nino: SimpleField([
    rules.nino.bind({
      allowWhitespace: true,
      errorMsg: {
        summary: 'nino:nino.errors.badFormat',
      },
    }),
  ]),
};
