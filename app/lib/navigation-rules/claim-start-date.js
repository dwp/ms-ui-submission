const moment = require('moment');
const { genericDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const claimStartDate = (req) => {
  appLogger.info('Navigation rules: claim start date');
  genericDataUtils.deleteIfPresent(req, 'late-claim', ['lateClaim']);
  if (req.url.includes('/claim-start-date') && typeof req.journeyData.getDataForPage('claim-end-date') !== 'undefined' && req.journeyData.getDataForPage('claim-end-date').claimEnd !== 'no') {
    genericDataUtils.deleteIfPresent(req, 'claim-end-date', ['claimEndDate', 'claimEnd', 'hiddenClaimStartDate']);
  }
  const claimStartDateInput = req.journeyData.getDataForPage('claim-start-date').claimStartDate;
  const claimStartDt = moment(`${claimStartDateInput.yyyy}-${claimStartDateInput.mm}-${claimStartDateInput.dd}`, 'YYYY-MM-DD').endOf('day');
  const dateThreeMonthAgo = moment().subtract(3, 'months').startOf('day');
  if (claimStartDt.isBefore(dateThreeMonthAgo)) {
    req.journeyData.setDataForPage('late-claim-check', { lateClaim: true });
  } else {
    req.journeyData.setDataForPage('late-claim-check', { lateClaim: false });
  }
};

module.exports = claimStartDate;
