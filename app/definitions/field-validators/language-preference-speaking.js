const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Language preference speaking validator');

module.exports = {
  langPrefSpeaking: SimpleField([
    rules.required.bind({
      errorMsg: 'language-preference-speaking:langPref.errors.required',
    }),
  ]),
};
