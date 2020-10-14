const Logger = require('../Logger');

const appLogger = Logger();

/**
 *
 * @param {object} journeyData the journey data
 * a page that doesn't contain any data when attempting to edit
 * from the cya screen. i.e. if there is a page(1)
 * that has a single yes no answer that is non-mandatory,
 * and there is a page(2) after that page(1) in the loop, when attempting to edit page 2
 * CASA will force the redirect to page 1 because the page has no data on it.
 * @return {undefined} undefined
 */
const setCoronaExistingConditionsToYes = (journeyData) => {
  appLogger.info('coronaDataUtils: setCoronaExistingConditionsToYes called');
  journeyData.setDataForPage('coronavirus-other-condition', {
    coronavirusOtherCondition: 'yes',
  });
};

module.exports = {
  setCoronaExistingConditionsToYes,
};
