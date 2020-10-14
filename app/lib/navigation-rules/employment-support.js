const { employmentDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const employmentSupport = (req) => {
  appLogger.info('Navigation rules: employment-support');
  if (req.session.editPage === 'employment-support') {
    employmentDataUtils.updateSpecificEmployment(req);
  }
};

module.exports = employmentSupport;
