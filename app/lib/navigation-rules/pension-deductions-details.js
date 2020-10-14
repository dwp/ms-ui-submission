const { pensionDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const pensionDeductionsDetails = (req) => {
  appLogger.info('Navigation rules: pension-deductions-details');
  if (req.session.editSection === 'pension') {
    pensionDataUtils.updateSpecificPension(req);
  }
};

module.exports = pensionDeductionsDetails;
