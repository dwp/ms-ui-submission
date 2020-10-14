const { employmentDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const employmentPayFrequencySameHours = (req) => {
  appLogger.info('Navigation rules: employment-pay-frequency-samehours');
  const page = req.session.editPage;
  if (page === 'employment-hours' || page === 'employment-pay-frequency-samehours') {
    employmentDataUtils.updateSpecificEmployment(req);
  }
};

module.exports = employmentPayFrequencySameHours;
