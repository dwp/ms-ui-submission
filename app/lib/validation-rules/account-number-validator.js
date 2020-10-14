module.exports = function validateAccountNumber(value) {
  const trimmedValue = value.replace(/\s/g, '');
  const accountNumberRegex = new RegExp(/^[0-9]*$/);
  const errorMsgNotNum = 'bank-details:accountNumber.errors.notNum';
  const errorBadLength = 'bank-details:accountNumber.errors.badLength';
  return new Promise((resolve, reject) => {
    if (accountNumberRegex.test(trimmedValue)) {
      if (trimmedValue.length === 8) {
        resolve();
      } else {
        reject(errorBadLength);
      }
    } else {
      reject(errorMsgNotNum);
    }
  });
};
