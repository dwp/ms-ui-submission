const { employmentDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const employmentLastWork = (req) => {
  appLogger.info('Navigation rules: employment-last-work');
  if (req.session.editSection === 'employment') {
    if (req.session.editPage === 'employment-last-work' || req.journeyData.getDataForPage('employment-off-sick').offSick === 'yes') {
      employmentDataUtils.updateSpecificEmployment(req);
    }
  } else if (req.journeyData.getDataForPage('employment-off-sick').offSick === 'yes') {
    employmentDataUtils.addEmploymentToGather(req);
  }
};

module.exports = employmentLastWork;
