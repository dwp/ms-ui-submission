const { employmentDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const employmentStatus = (req) => {
  appLogger.info('Navigation rules: employment-status');
  if (req.session.editSection === 'employment') {
    if (req.session.editPage === 'employment-status' || req.journeyData.getDataForPage('employment-off-sick').offSick === 'yes') {
      employmentDataUtils.updateSpecificEmployment(req);
    }
  } else if (req.journeyData.getDataForPage('employment-off-sick').offSick === 'yes') {
    employmentDataUtils.addEmploymentToGather(req);
  }
};

module.exports = employmentStatus;
