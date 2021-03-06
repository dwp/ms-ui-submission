const { genericDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const claimStartDateAfterSsp = (req) => {
  appLogger.info('Navigation rules: claim start date after ssp');
  if (req.url.includes('/claim-start-date-after-statutory-sick-pay')) {
    genericDataUtils.deleteIfPresent(req, 'claim-start-date', ['claimStartDate', 'hiddenSspEndDate']);
    genericDataUtils.deleteIfPresent(req, 'claim-end-date', ['claimEndDate', 'claimEnd', 'hiddenClaimStartDate']);
  }
};

module.exports = claimStartDateAfterSsp;
