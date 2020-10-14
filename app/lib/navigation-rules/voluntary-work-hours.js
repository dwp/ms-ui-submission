const { voluntaryDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const voluntaryWorkHours = (req) => {
  appLogger.info('Navigation rules: voluntary-work-hours');
  if (req.session.editSection === 'voluntary') {
    voluntaryDataUtils.updateSpecificVoluntary(req);
  } else {
    voluntaryDataUtils.addVoluntaryToGather(req);
  }
};

module.exports = voluntaryWorkHours;
