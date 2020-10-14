const { employmentDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const employmentPayFrequencyOther = (req) => {
  appLogger.info('Navigation rules: employment-pay-frequency-other');
  const page = req.session.editPage;
  if (page === 'employment-hours' || page === 'employment-pay-frequency-other') {
    employmentDataUtils.updateSpecificEmployment(req);
  }
};

module.exports = employmentPayFrequencyOther;
