const { genericDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const statutorySickPay = (req) => {
  appLogger.info('Navigation rules: statutory-sick-pay-recent');
  if (req.journeyData.getDataForPage('statutory-sick-pay-recent').sspRecent === 'no') {
    genericDataUtils.deleteIfPresent(req, 'statutory-sick-pay-end', ['sspEndDate']);
    genericDataUtils.deleteIfPresent(req, 'claim-start-date-after-statutory-sick-pay', ['claimStartDateAfterSsp']);
  }
};

module.exports = statutorySickPay;
