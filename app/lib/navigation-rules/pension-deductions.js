const { genericDataUtils, pensionDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const pensionDeductions = (req) => {
  appLogger.info('Navigation rules: pension-deductions');
  if (req.journeyData.getDataForPage('pension-payment') && !(req.session.editIndex === undefined || req.session.editIndex === null)) {
    const newDeductions = req.journeyData.getDataForPage('pension-deductions').deductions;
    const oldDeductions = req.session.pensionGather[req.session.editIndex].deductions;
    if (newDeductions !== oldDeductions) {
      appLogger.info('Navigation rules: pension-deductions - deductions answer has been changed, so clear relevant pages');
      if (!((newDeductions === 'no' && oldDeductions === 'notsure') || (newDeductions === 'notsure' && oldDeductions === 'no'))) {
        appLogger.info('Navigation rules: pension-deductions - deductions answer has either been changed to, or from, yes');
        genericDataUtils.deleteIfPresent(req, 'pension-payment', ['amount']);
        genericDataUtils.deleteIfPresent(req, 'pension-payment', ['amountBeforeDeductions']);
        genericDataUtils.deleteIfPresent(req, 'pension-payment', ['amountAfterDeductions']);
        genericDataUtils.deleteIfPresent(req, 'pension-deductions-details', ['deductionsDetails']);
      } else {
        pensionDataUtils.updateSpecificPension(req);
      }
    } else {
      pensionDataUtils.updateSpecificPension(req);
    }
  }
};

module.exports = pensionDeductions;
