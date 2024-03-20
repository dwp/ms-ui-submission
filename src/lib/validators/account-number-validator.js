import { ValidatorFactory, ValidationError } from '@dwp/govuk-casa';

class validateAccountNumber extends ValidatorFactory {
  validate(fieldValue, dataContext) {
    const config = {
      errorMsgNotNum: {
        summary: 'bank-details:accountNumber.errors.notNum',
      },
      errorBadLength: {
        summary: 'bank-details:accountNumber.errors.badLength',
      },
      ...this.config,
    };

    let { errorMsg } = config;

    const trimmedValue = fieldValue.replace(/\s/g, '');
    const accountNumberRegex = /^[0-9]*$/;

    if (accountNumberRegex.test(trimmedValue)) {
      if (trimmedValue.length !== 8) {
        errorMsg = config.errorBadLength;
        return [ValidationError.make({ errorMsg, dataContext })];
      }
    } else {
      errorMsg = config.errorMsgNotNum;
      return [ValidationError.make({ errorMsg, dataContext })];
    }

    return [];
  }
}

export default validateAccountNumber;
