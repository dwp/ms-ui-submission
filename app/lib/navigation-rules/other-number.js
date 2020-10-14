const { genericDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const otherNumber = (req) => {
  appLogger.info('Navigation rules: other-number');
  if (req.journeyData.getDataForPage('other-number').other === 'no') {
    genericDataUtils.deleteIfPresent(req, 'other-number', ['number']);
  }
};

module.exports = otherNumber;
