const { genericDataUtils } = require('../data-utils');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

const severeCondition = (req) => {
  appLogger.info('Navigation rules: severe-condition');
  if (req.journeyData.getDataForPage('severe-condition').severeCondition === 'no') {
    genericDataUtils.deleteIfPresent(req, 'ds1500-report', ['ds1500Report']);
  }
};

module.exports = severeCondition;
