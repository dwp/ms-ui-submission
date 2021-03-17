const { genericDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const statutorySickPay = (req) => {
  appLogger.info('Navigation rules: statutory-sick-pay-recent');
  if (req.journeyData.getDataForPage('statutory-sick-pay-recent').sspRecent === 'no') {
    genericDataUtils.deleteIfPresent(req, 'claim-start-date-after-statutory-sick-pay', ['claimStartDateAfterSsp']);
    genericDataUtils.deleteIfPresent(req, 'claim-start-date', ['claimStartDate']);
  }
  if (req.url.includes('/statutory-sick-pay-recent')) {
    genericDataUtils.deleteIfPresent(req, 'statutory-sick-pay-end', ['sspEndDate']);
  }
};

module.exports = statutorySickPay;
