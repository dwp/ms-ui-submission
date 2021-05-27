const { SimpleField, rules } = require('@dwp/govuk-casa/lib/Validation');
const validateAccountName = require('../../lib/validation-rules/account-name-validator.js');
const validateSpecialChar = require('../../lib/validation-rules/special-char-validator.js');
const validateAccountNumber = require('../../lib/validation-rules/account-number-validator.js');
const validateSortCode = require('../../lib/validation-rules/sort-code-validator.js');
const Logger = require('../../lib/Logger');

const appLogger = Logger();

appLogger.info('Bank details validator');

module.exports = {
  accountName: SimpleField([
    rules.required.bind({
      errorMsg: 'bank-details:accountName.errors.required',
    }),
    validateAccountName.bind({
      errorMsgConsecSpaces: 'bank-details:accountName.errors.consecSpaces',
      errorMsgConsecOther: 'bank-details:accountName.errors.consecOther',
      errorMsgStartAndEndFormat: 'bank-details:accountName.errors.startAndEndFormat',
      errorMsgStartFormat: 'bank-details:accountName.errors.startFormat',
      errorMsgEndFormat: 'bank-details:accountName.errors.endFormat',
    }),
    validateSpecialChar.bind({
      errorMsg: 'bank-details:accountName.errors.noSpecialChar',
    }),
  ]),
  bankName: SimpleField([
    rules.required.bind({
      errorMsg: 'bank-details:bankName.errors.required',
    }),
    validateSpecialChar.bind({
      errorMsg: 'bank-details:bankName.errors.noSpecialChar',
    }),
  ]),
  sortCode: SimpleField([
    rules.required.bind({
      errorMsg: 'bank-details:sortCode.errors.required',
    }),
    validateSortCode.bind({
      errorMsgNotNum: 'bank-details:sortCode.errors.notNum',
      errorBadLength: 'bank-details:sortCode.errors.badLength',
    }),
  ]),
  accountNumber: SimpleField([
    rules.required.bind({
      errorMsg: 'bank-details:accountNumber.errors.required',
    }),
    validateAccountNumber.bind({
      errorMsgNoSpecialChar: 'bank-details:bankName.errors.noSpecialChar',
    }),
  ]),
  rollNumber: SimpleField([
    rules.regex.bind({
      errorMsg: 'bank-details:rollNumber.errors.badFormat',
      pattern: /^[-\u058A\u05BE\u1806\u2010-\u2015\u2E17\u2E1A\u301C\u3030\u30A0\uFE31-\uFE32\uFE58\uFE63\uFF0D A-Za-z0-9.'/-]*$/,
    }),
  ]),
};
