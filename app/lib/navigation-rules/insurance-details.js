const { insuranceDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const insuranceDetails = (req) => {
  appLogger.info('Navigation rules: insurance-details');
  if (req.session.editSection === 'insurance') {
    insuranceDataUtils.updateSpecificInsurance(req);
  }
};

module.exports = insuranceDetails;
