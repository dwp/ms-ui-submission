const { genericDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const statutoryPay = (req) => {
  if (req.journeyData.getDataForPage('statutory-pay').statutoryPay === 'yes') {
    appLogger.info('Navigation rules: statutory-pay - statutoryPay = yes, clear ssp recent and its end date');
    genericDataUtils.deleteIfPresent(req, 'statutory-sick-pay-recent', ['sspRecent']);
    genericDataUtils.deleteIfPresent(req, 'statutory-sick-pay-recent-end', ['sspRecentEndDate']);
  }
  if (req.journeyData.getDataForPage('statutory-pay').statutoryPay === 'no') {
    appLogger.info('Navigation rules: statutory-pay - statutoryPay = no, clear ssp end date');
    genericDataUtils.deleteIfPresent(req, 'statutory-sick-pay-end', ['sspEndDate']);
  }
};

module.exports = statutoryPay;
