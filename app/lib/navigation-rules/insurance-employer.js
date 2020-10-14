const { insuranceDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const insuranceEmployer = (req) => {
  appLogger.info('Navigation rules: insurance-employer');
  if (req.session.editSection === 'insurance') {
    insuranceDataUtils.updateSpecificInsurance(req);
  }
};

module.exports = insuranceEmployer;
