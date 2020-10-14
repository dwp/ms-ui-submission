const Validation = require('@dwp/govuk-casa/lib/Validation');

const { rules, SimpleField } = Validation;

const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Voluntary work validator');

module.exports = {
  voluntaryWork: SimpleField([
    rules.required.bind({
      errorMsg: 'voluntary-work:voluntaryWork.errors.required',
    }),
  ], (pageData) => pageData.screen === 'voluntary-work'),

  other: SimpleField([
    rules.required.bind({
      errorMsg: 'voluntary-work:other.errors.required',
    }),
  ], (pageData) => pageData.screen === 'voluntary-work-other'),

  screen: SimpleField([
    rules.inArray.bind({
      source: ['voluntary-work', 'voluntary-work-other'],
    }),
  ]),
};
