const { genericDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const coronaOtherConditions = (req) => {
  appLogger.info('Navigation rules: corona other conditions');
  if (req.journeyData.getDataForPage('coronavirus-other-condition').coronavirusOtherCondition === 'no') {
    genericDataUtils.deleteIfPresent(req, 'conditions', ['conditions']);
  }
};

module.exports = coronaOtherConditions;
