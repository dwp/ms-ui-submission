const { pensionDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const pensionInherited = (req) => {
  appLogger.info('Navigation rules: pension-inherited');
  const values = req.journeyData.getDataForPage('pension-inherited');
  if (Object.keys(values).length === 0 && values.constructor === Object) {
    req.journeyData.setDataForPage('pension-inherited', { inherited: '' });
  }
  if (req.session.editSection === 'pension') {
    pensionDataUtils.updateSpecificPension(req);
  } else {
    pensionDataUtils.addPensionToGather(req);
  }
};

module.exports = pensionInherited;
