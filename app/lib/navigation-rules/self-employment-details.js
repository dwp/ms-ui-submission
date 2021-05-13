const { employmentDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();

const selfEmploymentDetails = (req) => {
  appLogger.info('Navigation rules: self-employment-details');
  if (req.session.editSection === 'employment' && req.url === '/self-employment-details?edit') {
    employmentDataUtils.updateSpecificEmployment(req);
  }
};

module.exports = selfEmploymentDetails;
