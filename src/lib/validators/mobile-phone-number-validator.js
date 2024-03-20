import pkg from 'google-libphonenumber';
import { ValidatorFactory, ValidationError } from '@dwp/govuk-casa';
import Logger from '../logger.js';

const { PhoneNumberType } = pkg;

const phoneUtil = pkg.PhoneNumberUtil.getInstance();

const appLogger = Logger();

class mobilePhoneNumberRule extends ValidatorFactory {
  name = 'mobilePhoneNumberRule';

  sanitise(fieldValue) {
    if (fieldValue !== null) {
      return fieldValue;
    }
    return undefined;
  }

  validate(fieldValue, dataContext) {
    const {
      errorMsg = {
        summary: 'mobile:phoneNumber.errors.badFormat',
      },
    } = this.config;

    const trimmedPhoneNumber = fieldValue.replace(/\s/g, '');
    try {
      const phoneNumber = phoneUtil.parseAndKeepRawInput(trimmedPhoneNumber, 'GB');
      if (phoneUtil.isValidNumber(phoneNumber) && phoneUtil.isPossibleNumber(phoneNumber)) {
        if (phoneUtil.getNumberType(phoneNumber) === PhoneNumberType.MOBILE) {
          return [];
        } if (phoneUtil.getNumberType(phoneNumber) === PhoneNumberType.FIXED_LINE_OR_MOBILE && phoneUtil.getRegionCodeForNumber(phoneNumber) !== 'GB') {
          return [];
        }
        return [ValidationError.make({ errorMsg, dataContext })];
      }
      return [ValidationError.make({ errorMsg, dataContext })];
    } catch (error) {
      appLogger.error(error.message);
      return [ValidationError.make({ errorMsg, dataContext })];
    }
  }
}

export default mobilePhoneNumberRule;
