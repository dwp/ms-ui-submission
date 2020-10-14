const { genericDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const employed = (req) => {
  appLogger.info('Navigation rules: employed');
  if (req.journeyData.getDataForPage('employed').employed === 'yes') {
    genericDataUtils.deleteIfPresent(req, 'statutory-sick-pay-recent', ['sspRecent']);
    genericDataUtils.deleteIfPresent(req, 'statutory-sick-pay-recent-end', ['sspRecentEndDate']);
  }
};

module.exports = employed;
