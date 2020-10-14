const { insuranceDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const insurancePremiums = (req) => {
  appLogger.info('Navigation rules: insurance-premiums');
  if (req.session.editSection === 'insurance') {
    if (req.journeyData.getDataForPage('insurance-premiums').premiums === 'yes') {
      insuranceDataUtils.updateSpecificInsurance(req);
    }
  }
};

module.exports = insurancePremiums;
