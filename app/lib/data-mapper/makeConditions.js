const Logger = require('../Logger');
const formatDigit = require('../../utils/formatDigit');

const appLogger = Logger();

/**
 * Build the Conditions part of the data structure.
 *
 * @param {object} conditionGather containing condition data
 * @return {array} array
 */
module.exports = (conditionGather) => {
  appLogger.info('makeConditions');
  return conditionGather.map((condition) => ({
    name: condition.conditionName,
    start_date: `${condition.conditionStartDate.yyyy}-${formatDigit(condition.conditionStartDate.mm)}-${formatDigit(condition.conditionStartDate.dd)}`,
  }));
};
