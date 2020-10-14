module.exports = function afterDeductionsCheck(fieldValue, dataContext) {
  const config = {
    errorMsg: 'pension-payment:amountAfterDeductions.errors.notLessThan',
    ...this,
  };
  const { amountBeforeDeductions, amountAfterDeductions } = dataContext.pageData;
  return new Promise((resolve, reject) => {
    const amountBefore = parseFloat(amountBeforeDeductions);
    const amountAfter = parseFloat(amountAfterDeductions);
    if (amountAfter >= amountBefore) {
      reject(config.errorMsg);
    } else {
      resolve();
    }
  });
};
