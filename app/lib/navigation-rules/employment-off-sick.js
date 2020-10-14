const { employmentDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const employmentOffSick = (req) => {
  appLogger.info('Navigation rules: employment-off-sick');
  const page = req.session.editPage;
  if (page) {
    const {
      employmentGather,
      editIndex,
    } = req.session;
    const journeyData = req.journeyData.getData();
    const existingEditSectionData = employmentGather[editIndex];
    if (existingEditSectionData.offSick === journeyData[page].offSick) {
      employmentDataUtils.updateSpecificEmployment(req);
    }
  }
};

module.exports = employmentOffSick;
