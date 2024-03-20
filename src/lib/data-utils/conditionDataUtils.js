import logger from '../logger.js';
import saveJourneyContext from './saveJourneyContext.js';

const appLogger = logger();

const getConditionFromJourneyData = (journeyData) => {
  appLogger.info('conditionDataUtils: getConditionFromJourneyData called');
  const conditionData = {
    conditionName: journeyData.conditions ? journeyData.conditions.conditionName : '',
    conditionStartDate: journeyData.conditions ? journeyData.conditions.conditionStartDate : '',
  };
  return conditionData;
};

const populateConditionJourneyData = (req, conditionsList, res, next, page) => {
  appLogger.info('conditionDataUtils: populateConditionJourneyData called');

  const lastElement = conditionsList.length > 1 ? conditionsList[conditionsList.length - 1] : conditionsList[0] || conditionsList;

  if (req && req.casa && req.casa.journeyContext) {
    req.casa.journeyContext.setDataForPage('conditions', {
      conditionName: lastElement.conditionName,
      conditionStartDate: lastElement.conditionStartDate,
    });
    req.casa.journeyContext.setDataForPage('another-health-condition', {
      anotherCondition: 'yes',
    });
  }
  saveJourneyContext(req, res, next, page);
};

const clearConditionJourneyData = (req) => {
  appLogger.info('conditionDataUtils: clearConditionJourneyData called');
  if (req && req.casa && req.casa.journeyContext) {
    req.casa.journeyContext.setDataForPage('conditions', Object.create(null));
    if (req.casa.journeyContext.data['another-health-condition'] && req.casa.journeyContext.data['another-health-condition'].anotherCondition === 'yes') {
      req.casa.journeyContext.setDataForPage('another-health-condition', Object.create(null));
    }
  }
};

const updateSpecificCondition = (payload, req, index = null) => {
  appLogger.info('conditionDataUtils: updateSpecificCondition called');
  const conditionData = getConditionFromJourneyData(payload);
  if (conditionData && !index) {
    req.session.conditionGather[req.session.conditionGather.length - 1] = conditionData;
    req.session.save();
  }
  else if (conditionData && index) req.session.conditionGather[index] = conditionData;
};

const getConditionsCount = (req) => {
  appLogger.info('conditionDataUtils: getConditionsCount called');
  return req.session.conditionGather.length;
};

const addConditionToGather = (payload, req, isBack = false) => {
  appLogger.info('conditionDataUtils: addConditionToGather called');
  const conditionData = getConditionFromJourneyData(payload);
  req.session.conditionGather = req.session.conditionGather || [];
  if (isBack) {
    req.session.conditionGather.splice(req.session.conditionGather.length - 1, 1);
  }
  if (getConditionsCount(req) < 12 && conditionData.conditionName) {
    req.session.conditionGather.push(conditionData);
    req.session.save();
  }
};

export default {
  getConditionFromJourneyData,
  populateConditionJourneyData,
  clearConditionJourneyData,
  updateSpecificCondition,
  addConditionToGather,
  getConditionsCount,
};
