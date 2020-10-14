const { insuranceDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const insurancePayment = (req) => {
  appLogger.info('Navigation rules: insurance-payment');
  if (req.session.editSection === 'insurance') {
    insuranceDataUtils.updateSpecificInsurance(req);
  } else {
    insuranceDataUtils.addInsuranceToGather(req);
  }
};

module.exports = insurancePayment;
