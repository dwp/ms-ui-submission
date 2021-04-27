const { genericDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const statutorySickPayEnd = (req) => {
  if (req.url.includes('/statutory-sick-pay-end')) {
    appLogger.info('Navigation rules: ssp-end');
    genericDataUtils.deleteIfPresent(req, 'claim-start-date', ['claimStartDate', 'hiddenSspEndDate']);
    genericDataUtils.deleteIfPresent(req, 'claim-start-date-after-statutory-sick-pay', ['claimStartDateAfterSsp']);
  }
};

module.exports = statutorySickPayEnd;
