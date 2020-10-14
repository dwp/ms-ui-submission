const { pensionDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const pensionFrequency = (req) => {
  appLogger.info('Navigation rules: pension-frequency');
  const values = req.journeyData.getDataForPage('pension-frequency');
  if (Object.keys(values).length === 0 && values.constructor === Object) {
    req.journeyData.setDataForPage('pension-frequency', { frequency: 'none' });
  }
  if (req.session.editSection === 'pension') {
    pensionDataUtils.updateSpecificPension(req);
  }
};

module.exports = pensionFrequency;
