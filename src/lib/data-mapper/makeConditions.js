import Logger from '../logger.js';
import formatDigit from '../../../app/utils/formatDigit.js';

const appLogger = Logger();

/**
 * Build the Conditions part of the data structure.
 *
 * @param {object} conditionGather Containing condition data.
 * @returns {Array} Array.
 */
export default (conditionGather) => {
  appLogger.info('makeConditions');
  return conditionGather.map((condition) => ({
    name: condition.conditionName,
    start_date: `${condition.conditionStartDate.yyyy}-${formatDigit(condition.conditionStartDate.mm)}-${formatDigit(condition.conditionStartDate.dd)}`,
  }));
};
