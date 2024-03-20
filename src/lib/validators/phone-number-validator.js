import { ValidatorFactory, ValidationError } from '@dwp/govuk-casa';

class phoneNumberRule extends ValidatorFactory {
  name = 'phoneNumberRule';

  sanitise(fieldValue) {
    if (fieldValue !== null) {
      return fieldValue;
    }
    return undefined;
  }

  validate(fieldValue, dataContext) {
    const {
      errorMsg = {
        summary: 'email:input.errors.badFormat',
      },
    } = this.config;

    const trimmedPhoneNumber = fieldValue.replace(/\s/g, '');
    const phoneNumber = trimmedPhoneNumber;
    const regex = /^\+{0,2}[-\u058A\u05BE\u1806\u2010-\u2015\u2E17\u2E1A\u301C\u3030\u30A0\uFE31-\uFE32\uFE58\uFE63\uFF0D ()0-9]+$/;

    if (!regex.test(phoneNumber) || (phoneNumber.length < 11 || phoneNumber.length > 20)) {
      return [ValidationError.make({ errorMsg, dataContext })];
    }
    return [];
  }
}

export default phoneNumberRule;
