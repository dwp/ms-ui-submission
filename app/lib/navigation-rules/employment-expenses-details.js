const { employmentDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const employmentExpensesDetails = (req) => {
  appLogger.info('Navigation rules: employment-expenses-details - expenses = yes, so last page in journey');
  if (req.session.editSection === 'employment') {
    employmentDataUtils.updateSpecificEmployment(req);
  } else {
    employmentDataUtils.addEmploymentToGather(req);
  }
};

module.exports = employmentExpensesDetails;
