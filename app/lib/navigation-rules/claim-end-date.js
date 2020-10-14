const { genericDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const claimEndDate = (req) => {
  appLogger.info('Navigation rules: claim end date');
  if (req.journeyData.getDataForPage('claim-end-date').claimEnd === 'no') {
    genericDataUtils.deleteIfPresent(req, 'claim-end-date', ['claimEndDate']);
  }
};

module.exports = claimEndDate;
