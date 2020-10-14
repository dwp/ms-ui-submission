const { genericDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const pregnant = (req) => {
  appLogger.info('Navigation rules: pregnant');
  if (req.journeyData.getDataForPage('pregnant').pregnant === 'no') {
    genericDataUtils.deleteIfPresent(req, 'pregnant', ['dueDate']);
  }
};

module.exports = pregnant;
