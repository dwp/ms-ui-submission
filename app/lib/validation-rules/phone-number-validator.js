module.exports = function phoneNumberRule(fieldValue) {
  const config = {
    errorMsg: 'medical-centre:phoneNumber.errors.badFormat',
    ...this,
  };
  const phoneNumber = fieldValue;
  const regex = /^\+{0,2}[-\u058A\u05BE\u1806\u2010-\u2015\u2E17\u2E1A\u301C\u3030\u30A0\uFE31-\uFE32\uFE58\uFE63\uFF0D ()0-9]+$/;
  return new Promise((resolve, reject) => {
    if (!regex.test(phoneNumber)) {
      reject(config.errorMsg);
    }
    resolve();
  });
};
