const { employmentDataUtils, genericDataUtils } = require('../../lib/data-utils');
const Logger = require('../../lib/Logger');

const appLogger = Logger();
const employmentHours = (req) => {
  if (req.session.editPage === 'employment-hours') {
    appLogger.info('Navigation rules: employment-hours - edit this page');
    const newEmpHours = req.journeyData.getDataForPage('employment-hours');
    const newSameHours = newEmpHours.sameHours;
    const newHours = newEmpHours.hours;
    const oldSameHours = req.session.employmentGather[req.session.editIndex].sameHours;
    const oldHours = req.session.employmentGather[req.session.editIndex].hours;

    if (oldSameHours === newSameHours && oldHours === newHours) {
      appLogger.info('No change in sameHours or hours');
      employmentDataUtils.clearEmploymentJourneyData(req);
      req.journeyData.setDataForPage('employed', { other: 'no', screen: 'employed-other' });
    } else {
      appLogger.info('Either sameHours or hours has changed; check whether change is significant enough to change the question for pay frequency');
      let changeIt = false;
      if (oldSameHours === 'yes' && oldHours === '0' && newSameHours === 'yes' && newHours !== '0' && newHours !== '') {
        changeIt = true;
      }
      if (oldSameHours === 'yes' && oldHours !== '0' && oldHours !== '' && newSameHours === 'yes' && newHours === '0') {
        changeIt = true;
      }
      if (oldSameHours === 'yes' && oldHours !== '0' && oldHours !== '' && newSameHours === 'no') {
        changeIt = true;
      }
      if (oldSameHours === 'no' && newSameHours === 'yes' && newHours !== '0' && newHours !== '') {
        changeIt = true;
      }
      if (changeIt) {
        appLogger.info('Page for pay frequency needs to change; clear pay frequency pages to force correct pay frequency page');
        if (newSameHours === 'no') {
          newEmpHours.hours = '';
          req.journeyData.setDataForPage('employment-hours', newEmpHours);
        }
        genericDataUtils.deleteIfPresent(req, 'employment-pay-frequency-samehours', ['frequency', 'netPay']);
        genericDataUtils.deleteIfPresent(req, 'employment-pay-frequency-other', ['frequency', 'netPay']);
      } else {
        appLogger.info('Page for pay frequency does not need to change; update employment hours page');
        employmentDataUtils.updateSpecificEmployment(req);
        req.journeyData.setDataForPage('employed', { other: 'no', screen: 'employed-other' });
      }
    }
  }
};

module.exports = employmentHours;
