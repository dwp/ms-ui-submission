const Logger = require('../Logger');
const formatDigit = require('../../utils/formatDigit');

const appLogger = Logger();

/**
 * Build the Conditions part of the data structure.
 *
 * @param {object} journeyData containing page data
 * @return {array} array
 */
module.exports = (journeyData) => {
  appLogger.info('makeConditions');
  const conditions = journeyData.getDataForPage('conditions');
  return conditions.conditions.map((condition) => ({
    name: condition.name,
    start_date: `${condition.conditionStartDate.yyyy}-${formatDigit(condition.conditionStartDate.mm)}-${formatDigit(condition.conditionStartDate.dd)}`,
  }));
};
