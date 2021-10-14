const Logger = require('../Logger');

const appLogger = Logger();

const getConditionFromJourneyData = (journeyData) => {
  appLogger.info('conditionDataUtils: getConditionFromJourneyData called');
  const conditionData = {
    conditionName: journeyData.conditions ? journeyData.conditions.conditionName : '',
    conditionStartDate: journeyData.conditions ? journeyData.conditions.conditionStartDate : '',
  };
  return conditionData;
};

const populateConditionJourneyData = (journeyData, data) => {
  appLogger.info('conditionDataUtils: populateConditionJourneyData called');
  journeyData.setDataForPage('conditions', {
    conditionName: data.conditionName,
    conditionStartDate: data.conditionStartDate,
  });
  journeyData.setDataForPage('another-health-condition', {
    anotherCondition: 'yes',
  });
};

const clearConditionJourneyData = (req) => {
  appLogger.info('conditionDataUtils: clearConditionJourneyData called');
  req.journeyData.setDataForPage('conditions', undefined);
  if (req.journeyData.getDataForPage('another-health-condition') && req.journeyData.getDataForPage('another-health-condition').anotherCondition === 'yes') {
    req.journeyData.setDataForPage('another-health-condition', undefined);
  }
};

const updateSpecificCondition = (req) => {
  appLogger.info('conditionDataUtils: updateSpecificCondition called');
  const conditionData = getConditionFromJourneyData(req.journeyData.getData());
  req.session.conditionGather[req.session.editIndex] = conditionData;
  clearConditionJourneyData(req);
};

const getConditionsCount = (req) => {
  appLogger.info('conditionDataUtils: getConditionsCount called');
  return req.session.conditionGather.length;
};

const addConditionToGather = (req, isBack = false) => {
  appLogger.info('conditionDataUtils: addConditionToGather called');
  const conditionData = getConditionFromJourneyData(req.journeyData.getData());
  req.session.conditionGather = req.session.conditionGather || [];
  if (isBack) {
    req.session.conditionGather.splice(req.session.conditionGather.length - 1, 1);
  }
  req.session.conditionGather.push(conditionData);
};

module.exports = {
  getConditionFromJourneyData,
  populateConditionJourneyData,
  clearConditionJourneyData,
  updateSpecificCondition,
  addConditionToGather,
  getConditionsCount,
};
