module.exports = function validateSortCode(value) {
  const trimmedValue = value.replace(/\s/g, '');
  const sortCodeRegex = new RegExp(/^[0-9]*$/);
  const errorMsgNotNum = 'bank-details:sortCode.errors.notNum';
  const errorBadLength = 'bank-details:sortCode.errors.badLength';
  return new Promise((resolve, reject) => {
    if (sortCodeRegex.test(trimmedValue)) {
      if (trimmedValue.length === 6) {
        resolve();
      } else {
        reject(errorBadLength);
      }
    } else {
      reject(errorMsgNotNum);
    }
  });
};
