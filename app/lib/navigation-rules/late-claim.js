const { genericDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const claimEndDate = (req) => {
  appLogger.info('Navigation rules: late claim');
  genericDataUtils.deleteIfPresent(req, 'late-claim-check', ['lateClaim']);
  if (req.journeyData.getDataForPage('late-claim').lateClaim === 'no') {
    genericDataUtils.deleteIfPresent(req, 'claim-start-date', ['claimStartDate', 'hiddenSspEndDate']);
  }
};

module.exports = claimEndDate;
