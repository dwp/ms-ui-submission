const { conditionDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const anotherHealthCondition = (req) => {
  appLogger.info('Navigation rules: conditions');
  if (conditionDataUtils.getConditionsCount(req) > 11) {
    req.journeyData.setDataForPage('condition-full', { limitReached: true });
  }
  if (req.session.editSection === 'condition') {
    conditionDataUtils.updateSpecificCondition(req);
  } else if (req.journeyData.getDataForPage('another-health-condition').anotherCondition === 'no') {
    conditionDataUtils.clearConditionJourneyData(req);
  } else {
    conditionDataUtils.clearConditionJourneyData(req);
  }
};

module.exports = anotherHealthCondition;
