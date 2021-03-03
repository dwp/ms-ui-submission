const { genericDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const claimStartDateAfterSsp = (req) => {
  appLogger.info('Navigation rules: claim start date after ssp');
  if (req.journeyData.getDataForPage('claim-start-date-after-statutory-sick-pay').claimStartDateAfterSsp === 'yes') {
    genericDataUtils.deleteIfPresent(req, 'claim-start-date', ['claimStartDate']);
  }
};

module.exports = claimStartDateAfterSsp;
