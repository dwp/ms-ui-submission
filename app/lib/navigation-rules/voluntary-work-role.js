const { voluntaryDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const voluntaryWorkRole = (req) => {
  appLogger.info('Navigation rules: voluntary-work-role');
  if (req.session.editSection === 'voluntary') {
    voluntaryDataUtils.updateSpecificVoluntary(req);
  }
};

module.exports = voluntaryWorkRole;
