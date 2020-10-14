const { pensionDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const pensionDetails = (req) => {
  appLogger.info('Navigation rules: pension-details');
  if (req.session.editSection === 'pension') {
    pensionDataUtils.updateSpecificPension(req);
  }
};

module.exports = pensionDetails;
