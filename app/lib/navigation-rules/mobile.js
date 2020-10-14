const { genericDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const mobile = (req) => {
  appLogger.info('Navigation rules: mobile');
  if (req.journeyData.getDataForPage('mobile').mobile === 'no') {
    genericDataUtils.deleteIfPresent(req, 'mobile', ['number']);
  } else {
    genericDataUtils.deleteIfPresent(req, 'other-number', ['other', 'number']);
  }
};

module.exports = mobile;
