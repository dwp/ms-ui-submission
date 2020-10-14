const { voluntaryDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const voluntaryWorkDetails = (req) => {
  appLogger.info('Navigation rules: voluntary-work-details');
  if (req.session.editSection === 'voluntary') {
    voluntaryDataUtils.updateSpecificVoluntary(req);
  }
};

module.exports = voluntaryWorkDetails;
