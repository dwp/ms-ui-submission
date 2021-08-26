const { SimpleField, rules: { required, inArray, email } } = require('@dwp/govuk-casa/lib/Validation');
const { validateEmail } = require('../../lib/validation-rules/email-validator');

module.exports = {
  emailProvided: SimpleField([
    required.bind({ errorMsg: 'email:radio.errors.required' }),
    inArray.bind({ source: ['yes', 'no'], errorMsg: 'email:radio.errors.required' }),
  ]),
  email: SimpleField(
    [
      required.bind({ errorMsg: 'email:input.errors.required' }),
      email.bind({ errorMsg: 'email:input.errors.badFormat' }),
      validateEmail.bind({ errorMsg: 'email:input.errors.badFormat' }),
    ],
    (pageData) => pageData.emailProvided === 'yes',
  ),
};
