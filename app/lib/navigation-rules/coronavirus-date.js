const Logger = require('../../lib/Logger');

const appLogger = Logger();
const coronavirus = (req) => {
  appLogger.info('Navigation rules: coronavirus date');
  if (req.editOriginUrl === '/coronavirus-date' && req.session.editing === true) {
    if (req.session.conditionGather && req.session.conditionGather.length > 0) {
      req.journeyData.setDataForPage('coronavirus-other-condition', { coronavirusOtherCondition: 'yes' });
    } else {
      req.journeyData.setDataForPage('coronavirus-other-condition', { coronavirusOtherCondition: 'no' });
    }
  }
};

module.exports = coronavirus;
