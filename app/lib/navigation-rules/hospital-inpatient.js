const { genericDataUtils } = require('../data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const hospitalInpatient = (req) => {
  if (req.journeyData.getDataForPage('hospital-inpatient').hospitalInpatient === 'no') {
    appLogger.info('Navigation rules: hospital-inpatient - not inpatient; make sure hospital details cleared from journey');
    genericDataUtils.deleteIfPresent(req, 'hospital-inpatient', ['hospitalName', 'hospitalWard', 'admissionDate']);
  }
};

module.exports = hospitalInpatient;
