import { ValidatorFactory, ValidationError } from '@dwp/govuk-casa';

class validateSortCode extends ValidatorFactory {
  validate(fieldValue, dataContext) {
    const config = {
      errorMsgNotNum: {
        summary: 'bank-details:sortCode.errors.notNum',
      },
      errorBadLength: {
        summary: 'bank-details:sortCode.errors.badLength',
      },
      ...this.config,
    };

    let { errorMsg } = config;

    const trimmedValue = fieldValue.replace(/\s/g, '');
    const sortCodeRegex = /^[0-9]*$/;

    if (sortCodeRegex.test(trimmedValue)) {
      if (trimmedValue.length !== 6) {
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

export default validateSortCode;
