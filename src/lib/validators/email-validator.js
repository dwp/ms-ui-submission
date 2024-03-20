import { ValidatorFactory, ValidationError } from '@dwp/govuk-casa';
import validateEmails from '../../../app/utils/email-validator.js';

class emailValidator extends ValidatorFactory {
  name = 'emailValidator';

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

    if (validateEmails.validateEmail(fieldValue)) {
      return [];
    }
    return [ValidationError.make({ errorMsg, dataContext })];
  }
}

export default emailValidator;
