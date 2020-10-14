const isEqual = require('lodash.isequal');
const Logger = require('../Logger');

const { getEmploymentFromJourneyData, clearEmploymentJourneyData } = require('./employmentDataUtils');
const { getInsuranceFromJourneyData, clearInsuranceJourneyData } = require('./insuranceDataUtils');
const { getPensionFromJourneyData, clearPensionJourneyData } = require('./pensionDataUtils');
const { getVoluntaryFromJourneyData, clearVoluntaryJourneyData } = require('./voluntaryDataUtils');

const appLogger = Logger();

/**
 * Checks if any attributes within a given object contain data. Empty strings
 * and null values do not constitute valid data in this case.
 *
 * @param  {object} obj Object to test
 * @return {Boolean} True if object contains data, false otherwise
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
 * @param  {object} obj Object to convert to array
 * @param  {function} filter Optional filter function
 * @return {array|object} Converted array, or the original if cannot convert
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
 * @param  {object} data Object to convert to array
 * @return {array|object} Converted array, or original if cannot convert
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
 * page provided in the second
 *
 * @param {object} req - request hat journeyData and session are on
 * @param  {string} page - name of page
 * @param {array} dataItems - data items to be deleted from the journeyData for that page
 * @return {bool} result - true if page data exists and delete went OK, else false
 */
const deleteIfPresent = (req, page, dataItems) => {
  appLogger.info('genericDataUtils: deleteIfPresent called');
  appLogger.info(`Deleting ${dataItems} from ${page}`);
  let result = false;
  const pageData = req.journeyData.getDataForPage(page);
  if (pageData) {
    for (let i = 0; i < dataItems.length; i++) {
      delete pageData[dataItems[i]];
    }
    req.journeyData.setDataForPage(page, pageData);
    result = true;
  }
  return result;
};

const setInitialSectionQuestion = (journeyData, section, answer, target) => {
  appLogger.info('genericDataUtils: setInitialSectionQuestion called');
  const map = {
    voluntary: {
      page: 'voluntary-work',
      initial: { voluntaryWork: answer, screen: 'voluntary-work' },
      loop: { other: answer, screen: 'voluntary-work-other' },
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
  journeyData.setDataForPage(
    map[section].page,
    map[section][target],
  );
};

const cancelEdit = (req) => {
  appLogger.info('genericDataUtils: cancelEdit called');
  switch (req.session.editSection) {
  case 'voluntary':
    appLogger.info('Cancel from edit voluntary work');
    // eslint-disable-next-line max-len
    if (isEqual(getVoluntaryFromJourneyData(req.journeyData.getData()), req.session.voluntaryGather[req.session.editIndex])) {
      clearVoluntaryJourneyData(req);
      req.journeyData.setDataForPage('voluntary-work', { other: 'no', screen: 'voluntary-work-other' });
    }
    break;
  case 'employment':
    appLogger.info('Cancel from edit employment');
    // eslint-disable-next-line max-len
    if (isEqual(getEmploymentFromJourneyData(req.journeyData.getData()), req.session.employmentGather[req.session.editIndex])) {
      clearEmploymentJourneyData(req);
      req.journeyData.setDataForPage('employed', { other: 'no', screen: 'employed-other' });
    }
    break;
  case 'pension':
    appLogger.info('Cancel from edit pension');
    // eslint-disable-next-line max-len
    if (isEqual(getPensionFromJourneyData(req.journeyData.getData()), req.session.pensionGather[req.session.editIndex])) {
      clearPensionJourneyData(req);
      req.journeyData.setDataForPage('pension', { other: 'no', screen: 'pension-other' });
    }
    break;
  case 'insurance':
    appLogger.info('Cancel from edit insurance ');
    // eslint-disable-next-line max-len
    if (isEqual(getInsuranceFromJourneyData(req.journeyData.getData()), req.session.insuranceGather[req.session.editIndex])) {
      clearInsuranceJourneyData(req);
      req.journeyData.setDataForPage('insurance', { other: 'no', screen: 'insurance-other' });
    }
    break;
  default:
    appLogger.info(`Unknown section ${req.session.editSection}: redirecting to check-your-answers`);
    break;
  }
};

module.exports = {
  hasData,
  convertToArrayAndFilter,
  convertToArrayAndFilterBlanks,
  deleteIfPresent,
  setInitialSectionQuestion,
  cancelEdit,
};
