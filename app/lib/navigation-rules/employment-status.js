const { employmentDataUtils, genericDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const employmentStatus = (req) => {
  appLogger.info('Navigation rules: employment status');
  if ((req.session.isSelfEmployed && !req.journeyData.getDataForPage('employment-status').workTypes.includes('selfEmployed'))
      || (!req.session.isSelfEmployed && req.journeyData.getDataForPage('employment-status').workTypes.includes('selfEmployed'))) {
    genericDataUtils.deleteIfPresent(req, 'employment-details', ['jobTitle', 'employerName', 'employerTel', 'employerAddress']);
    genericDataUtils.deleteIfPresent(req, 'self-employment-details', ['jobTitle', 'employerName', 'employerTel', 'employerAddress']);
    genericDataUtils.deleteIfPresent(req, 'employment-off-sick', ['offSick']);
    genericDataUtils.deleteIfPresent(req, 'employment-last-work', ['lastWorkedDate']);
    genericDataUtils.deleteIfPresent(req, 'employment-hours', ['sameHours', 'hours']);
    genericDataUtils.deleteIfPresent(req, 'employment-pay-frequency-samehours', ['frequency', 'netPay']);
    genericDataUtils.deleteIfPresent(req, 'employment-pay-frequency-other', ['frequency', 'netPay']);
    genericDataUtils.deleteIfPresent(req, 'employment-support', ['support']);
    genericDataUtils.deleteIfPresent(req, 'employment-expenses', ['expenses']);
    genericDataUtils.deleteIfPresent(req, 'employment-expenses-details', ['expensesDetails']);
  } else if (req.session.editPage === 'employment-status') {
    employmentDataUtils.updateSpecificEmployment(req);
  }
};

module.exports = employmentStatus;
