const { genericDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');
const { postcodeLookup } = require('../postcode-lookup/postcode-lookup.js');

const appLogger = Logger();
const address = (req) => {
  appLogger.info('Navigation rules: address');
  if (req.journeyData.getDataForPage('address').correspondence === 'yes') {
    genericDataUtils.deleteIfPresent(req, 'correspondence-address', ['correspondenceAddress']);
  }
  const isWelsh = postcodeLookup(req.journeyData.getDataForPage('address').address.postcode);
  req.journeyData.setDataForPage('postcode', { welsh: isWelsh });
  if (!isWelsh) {
    genericDataUtils.deleteIfPresent(req, 'language-preference-writing', ['langPrefWriting']);
    genericDataUtils.deleteIfPresent(req, 'language-preference-speaking', ['langPrefSpeaking']);
  }
};

module.exports = address;
