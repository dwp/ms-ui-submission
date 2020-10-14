const { employmentDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const employmentExpenses = (req) => {
  appLogger.info('Navigation rules: employment-expenses');
  if (req.journeyData.getDataForPage('employment-expenses').expenses === 'no') {
    appLogger.info('Navigation rules: employment-expenses - expenses = no, so last page in journey');
    if (req.session.editSection === 'employment') {
      employmentDataUtils.updateSpecificEmployment(req);
    } else {
      employmentDataUtils.addEmploymentToGather(req);
    }
  }
};

module.exports = employmentExpenses;
