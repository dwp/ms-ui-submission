const { conditionDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const conditions = (req) => {
  appLogger.info('Navigation rules: conditions');
  if (req.session.editSection === 'condition') {
    req.journeyData.setDataForPage('another-health-condition', { anotherCondition: 'no' });
    conditionDataUtils.updateSpecificCondition(req);
  } else {
    const isBack = req.session.conditionBack === true;
    req.session.conditionBack = false;
    conditionDataUtils.addConditionToGather(req, isBack);
  }
};

module.exports = conditions;
