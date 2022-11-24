const Logger = require('../../lib/Logger');

const appLogger = Logger();

const statutoryPayNoReason = (req) => {
  appLogger.info('Navigation rules: reason-no-sick-pay');
  return req.journeyData.getDataForPage('reason-no-sick-pay').statutoryPayNoReason;
};

module.exports = statutoryPayNoReason;
