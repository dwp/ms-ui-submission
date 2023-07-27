const { genericDataUtils } = require('../data-utils');

const Logger = require('../../lib/Logger');

const appLogger = Logger();

const severeCondition = (req) => {
  appLogger.info('Navigation rules: live-less-than-12-months');
  if (req.journeyData.getDataForPage('live-less-than-12-months').severeCondition === 'no') {
    genericDataUtils.deleteIfPresent(req, 'sr1-report', ['sr1Report']);
  }
};

module.exports = severeCondition;
