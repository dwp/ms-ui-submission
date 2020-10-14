const { genericDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const coronaReason = (req) => {
  appLogger.info('Navigation rules: corona reason');
  genericDataUtils.deleteIfPresent(req, 'coronavirus-date', ['coronavirusDate']);
  genericDataUtils.deleteIfPresent(req, 'coronavirus-other-condition', ['coronavirusOtherCondition']);
  if (req.journeyData.getDataForPage('coronavirus-reason-for-claim').coronavirusReasonForClaim !== 'high-risk') {
    genericDataUtils.deleteIfPresent(req, 'coronavirus-shielding', ['coronavirusShielding']);
  }
  if (req.journeyData.getDataForPage('coronavirus-reason-for-claim').coronavirusReasonForClaim !== 'other') {
    genericDataUtils.deleteIfPresent(req, 'coronavirus-reason-for-claim', ['otherReasonDetail']);
  }
};

module.exports = coronaReason;
