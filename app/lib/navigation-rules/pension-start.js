const { pensionDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const pensionStart = (req) => {
  appLogger.info('Navigation rules: pension-start');
  if (req.session.editSection === 'pension') {
    pensionDataUtils.updateSpecificPension(req);
  }
};

module.exports = pensionStart;
