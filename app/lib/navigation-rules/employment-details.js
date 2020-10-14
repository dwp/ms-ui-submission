const { employmentDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();

const employmentDetails = (req) => {
  appLogger.info('Navigation rules: employment-details');
  if (req.session.editSection === 'employment') {
    employmentDataUtils.updateSpecificEmployment(req);
  }
};

module.exports = employmentDetails;
