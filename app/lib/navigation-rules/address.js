const { genericDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const address = (req) => {
  appLogger.info('Navigation rules: address');
  if (req.journeyData.getDataForPage('address').correspondence === 'yes') {
    genericDataUtils.deleteIfPresent(req, 'address', ['correspondenceAddress']);
  }
};

module.exports = address;
