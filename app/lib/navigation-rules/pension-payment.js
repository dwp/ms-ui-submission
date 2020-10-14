const { pensionDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const pensionPayment = (req) => {
  appLogger.info('Navigation rules: pension-payment');
  if (req.session.editSection === 'pension') {
    if ((req.journeyData.getDataForPage('pension-deductions').deductions === 'no') || (req.journeyData.getDataForPage('pension-deductions').deductions === 'notsure')) {
      pensionDataUtils.updateSpecificPension(req);
    }
  }
};

module.exports = pensionPayment;
