const { genericDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const coronavirus = (req) => {
  appLogger.info('Navigation rules: coronavirus');
  if (req.journeyData.getDataForPage('coronavirus').coronavirusReasonForClaim === 'no') {
    genericDataUtils.deleteIfPresent(req, 'coronavirus-reason-for-claim', ['coronavirusReasonForClaim', 'otherReasonDetail']);
    genericDataUtils.deleteIfPresent(req, 'coronavirus-shielding', ['coronavirusShielding']);
    genericDataUtils.deleteIfPresent(req, 'coronavirus-date', ['coronavirusDate']);
    genericDataUtils.deleteIfPresent(req, 'coronavirus-other-condition', ['coronavirusOtherCondition']);
  }
};

module.exports = coronavirus;
