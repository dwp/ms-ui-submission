const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const { PhoneNumberType } = require('google-libphonenumber');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

module.exports = function phoneNumberRule(fieldValue) {
  const config = {
    errorMsg: 'medical-centre:phoneNumber.errors.badFormat',
    ...this,
  };
  return new Promise((resolve, reject) => {
    const trimmedPhoneNumber = fieldValue.replace(/\s/g, '');
    try {
      const phoneNumber = phoneUtil.parseAndKeepRawInput(trimmedPhoneNumber, 'GB');
      if (phoneUtil.isValidNumber(phoneNumber) && phoneUtil.isPossibleNumber(phoneNumber)) {
        if (phoneUtil.getNumberType(phoneNumber) === PhoneNumberType.MOBILE) {
          resolve();
        } else if (phoneUtil.getNumberType(phoneNumber) === PhoneNumberType.FIXED_LINE_OR_MOBILE && phoneUtil.getRegionCodeForNumber(phoneNumber) !== 'GB') {
          resolve();
        } else {
          reject(config.errorMsg);
        }
      } else {
        reject(config.errorMsg);
      }
    } catch (error) {
      appLogger.error(error.message);
      reject(config.errorMsg);
    }
  });
};
