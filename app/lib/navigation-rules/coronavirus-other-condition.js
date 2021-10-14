const { genericDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const coronaOtherConditions = (req) => {
  appLogger.info('Navigation rules: corona other conditions');
  if (req.journeyData.getDataForPage('coronavirus-other-condition')
    .coronavirusOtherCondition === 'no') {
    if (req.session.editing === true) {
      req.session.conditionGather = [];
      genericDataUtils.deleteIfPresent(req, 'another-health-condition', ['anotherCondition']);
    } else {
      genericDataUtils.deleteIfPresent(req, 'conditions', ['conditions']);
    }
  }

  if (req.journeyData.getDataForPage('coronavirus-other-condition')
    .coronavirusOtherCondition === 'yes' && req.session.editing === true) {
    req.journeyData.setDataForPage('another-health-condition', { anotherCondition: 'yes' });
  }
};

module.exports = coronaOtherConditions;
