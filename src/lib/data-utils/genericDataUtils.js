import isEqual from 'lodash.isequal';
import logger from '../logger.js';
import employmentDataDefault from './employmentDataUtils.js';
import voluntaryDataDefault from './voluntaryDataUtils.js';
import conditionDataDefault from './conditionDataUtils.js';

const appLogger = logger();

// eslint-disable-next-line
/**
 * Checks if any attributes within a given object contain data. Empty strings
 * and null values do not constitute valid data in this case.
 *
 * @param  {object} obj Object to test.
 * @returns {boolean} True if object contains data, false otherwise.
 */
const hasData = (obj) => {
  let populated = false;
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === 'object') {
      populated = populated || hasData(obj[k]);
    } else if (obj[k] !== '' && obj[k] !== null) {
      populated = true;
    }
  });
  return populated;
};
/**
 * In the UI, in order to support dynamic array elements, we use random,
 * non-numeric, unique indexes which is simpler for handling dynamic adding,
 * removal, re-ordering of elements within the UI. However, for semantic
 * correctness, we want to treat these as proper arrays so this function is
 * used to convert those indexes to numbers.
 *
 * Additionally, you can reduce the resulting array by applying an optional
 * filtering function, which takes the object, its index and the full array as
 * arguments. The function should return true to keep the element, or false to
 * remove it from the array.
 *
 * @param  {object} obj Object to convert to array.
 * @param  {Function} filter Optional filter function.
 * @returns {Array | object} Converted array, or the original if cannot convert.
 */
const convertToArrayAndFilter = (obj, filter) => {
  appLogger.info('genericDataUtils: convertToArrayAndFilter');
  if (typeof obj === 'undefined') {
    return obj;
  }

  let data = { ...obj };

  if (!Array.isArray(data)) {
    const converted = [];
    Object.keys(data).forEach((k) => {
      converted.push(data[k]);
    });
    data = converted;
  }

  if (typeof filter === 'function') {
    data = data.filter(filter);
  }

  if (data.length > 1 && !hasData(data[0])) {
    data.shift();
  }

  return data;
};
/**
 * As above, but includes a default filter function for weeding out blank
 * entries.
 *
 * @param  {object} data Object to convert to array.
 * @returns {Array | object} Converted array, or original if cannot convert.
 */
const convertToArrayAndFilterBlanks = (data) => {
  appLogger.info('genericDataUtils: convertToArrayAndFilterBlanks');
  const filtered = convertToArrayAndFilter(
    data,
    (obj, index) => {
      if (index === 0 || hasData(obj)) {
        return true;
      }
      return false;
    },
  );
  return filtered;
};

/**
 * Checks if data exists for the page in the first param and if so, deletes the items from that
 * page provided in the second.
 *
 * @param {object} req - Request hat journeyContext and session are on.
 * @param  {string} page - name of page.
 * @param {Array} dataItems - Data items to be deleted from the journeyContext for that page.
 * @returns {bool} Result - true if page data exists and delete went OK, else false.
 */
const deleteIfPresent = (req, page, dataItems) => {
  appLogger.info('genericDataUtils: deleteIfPresent called');
  appLogger.info(`Deleting ${dataItems} from ${page}`);
  let result = false;
  const pageData = req.casa.journeyContext.data[page];
  if (pageData) {
    for (let i = 0; i < dataItems.length; i++) {
      delete pageData[dataItems[i]];
    }
    req.casa.journeyContext.data[page, pageData];
    result = true;
  }
  return result;
};

const setInitialSectionQuestion = (journeyContext, section, answer, target) => {
  appLogger.info('genericDataUtils: setInitialSectionQuestion called');
  const map = {
    voluntary: {
      page: 'voluntary-work',
      initial: { voluntaryWork: answer, screen: 'voluntary-work' },
      loop: { other: answer, screen: 'voluntary-work-other' },
    },
    condition: {
      page: 'conditions',
      initial: { condition: answer, screen: 'condition' },
      loop: { other: answer, screen: 'condition-other' },
    },
    employment: {
      page: 'employed',
      initial: { employed: answer, screen: 'employed' },
      loop: { other: answer, screen: 'employed-other' },
    },
    pension: {
      page: 'pension',
      initial: { pension: answer, screen: 'pension' },
      loop: { other: answer, screen: 'pension-other' },
    },
    insurance: {
      page: 'insurance',
      initial: { insurance: answer, screen: 'insurance' },
      loop: { other: answer, screen: 'insurance-other' },
    },
  };
  journeyContext.data[
    map[section].page,
    map[section][target]
  ]; // help
};

const cancelEdit = (req) => {
  appLogger.info('genericDataUtils: cancelEdit called');
  switch (req.session?.editSection) {
    case 'condition':
      appLogger.info('Cancel from edit condition');
      // eslint-disable-next-line max-len
      if (isEqual(conditionDataDefault.getConditionFromJourneyData(req.casa.journeyContext.data), req.session.conditionGather[req.session.editIndex])) {
        req.casa.journeyContext.data['another-condition', { cyaJourney: 'no' }];
      }
      break;
    case 'voluntary':
      appLogger.info('Cancel from edit voluntary work');
      // eslint-disable-next-line max-len
      if (isEqual(voluntaryDataDefault.getVoluntaryFromJourneyData(req.casa.journeyContext.data), req.session.voluntaryGather[req.session.editIndex])) {
        req.casa.journeyContext.data['voluntary-work', { other: 'no', screen: 'voluntary-work-other' }];
      }
      break;
    case 'employment':
      appLogger.info('Cancel from edit employment');
      // eslint-disable-next-line max-len
      if (isEqual(employmentDataDefault.getEmploymentFromJourneyData(req.casa.journeyContext.data), req.session.employmentGather[req.session.editIndex])) {
        req.casa.journeyContext.data['employed', { employed: 'no', other: 'no', screen: 'employed-other' }];
      }
      break;
    default:
      appLogger.info(`Unknown section ${req.session?.editSection}: redirecting to check-your-answers`);
      break;
  }
};

export default {
  hasData,
  convertToArrayAndFilter,
  convertToArrayAndFilterBlanks,
  deleteIfPresent,
  setInitialSectionQuestion,
  cancelEdit,
};
