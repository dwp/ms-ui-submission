const { genericDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const claimStartDate = (req) => {
  appLogger.info('Navigation rules: claim start date');
  if (req.url.includes('/claim-start-date') && typeof req.journeyData.getDataForPage('claim-end-date') !== 'undefined' && req.journeyData.getDataForPage('claim-end-date').claimEnd !== 'no') {
    genericDataUtils.deleteIfPresent(req, 'claim-end-date', ['claimEndDate', 'claimEnd', 'hiddenClaimStartDate']);
  }
};

module.exports = claimStartDate;
