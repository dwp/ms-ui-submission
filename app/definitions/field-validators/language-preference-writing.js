const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Language preference writing validator');

module.exports = {
  langPrefWriting: SimpleField([
    rules.required.bind({
      errorMsg: 'language-preference-writing:langPref.errors.required',
    }),
  ]),
};
