const Logger = require('../Logger');

const appLogger = Logger();

const getEmploymentFromJourneyData = (journeyData) => {
  appLogger.info('employmentDataUtils: getEmploymentFromJourneyData called');
  const employmentData = {
    jobTitle: journeyData['employment-details'] ? journeyData['employment-details'].jobTitle : '',
    employerName: journeyData['employment-details'] ? journeyData['employment-details'].employerName : '',
    employerTel: journeyData['employment-details'] ? journeyData['employment-details'].employerTel : '',
    employerAddress: {
      address1: journeyData['employment-details'] ? journeyData['employment-details'].employerAddress.address1 : '',
      address2: journeyData['employment-details'] ? journeyData['employment-details'].employerAddress.address2 : '',
      address3: journeyData['employment-details'] ? journeyData['employment-details'].employerAddress.address3 : '',
      postcode: journeyData['employment-details'] ? journeyData['employment-details'].employerAddress.postcode : '',
    },
    offSick: journeyData['employment-off-sick'] ? journeyData['employment-off-sick'].offSick : '',
    workTypes: journeyData['employment-status'] && Array.isArray(journeyData['employment-status'].workTypes)
      ? journeyData['employment-status'].workTypes : [journeyData['employment-status'].workTypes],
  };
  if (journeyData['employment-off-sick'] && journeyData['employment-off-sick'].offSick === 'yes') {
    appLogger.info('offSick so need lastWorkedDate');
    employmentData.lastWorkedDate = journeyData['employment-last-work'] ? journeyData['employment-last-work'].lastWorkedDate : '';
  } else {
    appLogger.info('not offSick so collect additional info about employment');
    employmentData.sameHours = journeyData['employment-hours'] ? journeyData['employment-hours'].sameHours : '';
    if (journeyData['employment-hours'] && journeyData['employment-hours'].hours) {
      employmentData.hours = journeyData['employment-hours'].hours;
    }
    if (employmentData.sameHours === 'yes' && employmentData.hours !== '0') {
      employmentData.frequency = journeyData['employment-pay-frequency-samehours'] ? journeyData['employment-pay-frequency-samehours'].frequency : '';
      employmentData.netPay = journeyData['employment-pay-frequency-samehours'] ? journeyData['employment-pay-frequency-samehours'].netPay : '';
    } else {
      employmentData.frequency = journeyData['employment-pay-frequency-other'] ? journeyData['employment-pay-frequency-other'].frequency : '';
      employmentData.netPay = journeyData['employment-pay-frequency-other'] ? journeyData['employment-pay-frequency-other'].netPay : '';
    }
    employmentData.support = journeyData['employment-support'] ? journeyData['employment-support'].support : '';
    employmentData.expenses = journeyData['employment-expenses'] ? journeyData['employment-expenses'].expenses : '';
    if (journeyData['employment-expenses'] && journeyData['employment-expenses'].expenses === 'yes') {
      employmentData.expensesDetails = journeyData['employment-expenses-details'] ? journeyData['employment-expenses-details'].expensesDetails : '';
    }
  }
  return employmentData;
};

const populateEmploymentJourneyData = (journeyData, data) => {
  appLogger.info('employmentDataUtils: populateEmploymentJourneyData called');
  journeyData.setDataForPage('employment-details', {
    jobTitle: data.jobTitle,
    employerName: data.employerName,
    employerTel: data.employerTel,
    employerAddress: data.employerAddress,
  });
  journeyData.setDataForPage('employment-off-sick', {
    offSick: data.offSick,
  });
  journeyData.setDataForPage('employment-status', {
    workTypes: data.workTypes,
  });
  if (data.offSick === 'yes') {
    appLogger.info('offSick journey');
    journeyData.setDataForPage('employment-last-work', {
      lastWorkedDate: data.lastWorkedDate,
    });
  } else {
    appLogger.info('not offSick journey');
    const hoursData = {
      sameHours: data.sameHours,
    };
    if (data.sameHours === 'yes') {
      hoursData.hours = data.hours;
    }
    journeyData.setDataForPage('employment-hours', hoursData);
    const payFrequency = {
      frequency: data.frequency,
      netPay: data.netPay,
    };
    if (data.hours && data.hours > 0) {
      journeyData.setDataForPage('employment-pay-frequency-samehours', payFrequency);
    } else {
      journeyData.setDataForPage('employment-pay-frequency-other', payFrequency);
    }
    journeyData.setDataForPage('employment-support', {
      support: data.support,
    });
    journeyData.setDataForPage('employment-expenses', {
      expenses: data.expenses,
    });
    if (data.expenses === 'yes') {
      journeyData.setDataForPage('employment-expenses-details', {
        expensesDetails: data.expensesDetails,
      });
    }
  }
  journeyData.setDataForPage('employed', {
    screen: 'employed-other',
    other: 'yes',
  });
};

const clearEmploymentJourneyData = (req) => {
  appLogger.info('employmentDataUtils: clearEmploymentJourneyData called');
  req.journeyData.setDataForPage('employed', undefined);
  req.journeyData.setDataForPage('employment-details', undefined);
  req.journeyData.setDataForPage('employment-off-sick', undefined);
  req.journeyData.setDataForPage('employment-last-work', undefined);
  req.journeyData.setDataForPage('employment-status', undefined);
  req.journeyData.setDataForPage('employment-hours', undefined);
  req.journeyData.setDataForPage('employment-pay-frequency-samehours', undefined);
  req.journeyData.setDataForPage('employment-pay-frequency-other', undefined);
  req.journeyData.setDataForPage('employment-support', undefined);
  req.journeyData.setDataForPage('employment-expenses', undefined);
  req.journeyData.setDataForPage('employment-expenses-details', undefined);
};

// Update a specific instance of employment in the gather, and clear the employment journey data
// ready for another to be gathered
const updateSpecificEmployment = (req) => {
  appLogger.info('employmentDataUtils: updateSpecificEmployment called');
  const employmentData = getEmploymentFromJourneyData(req.journeyData.getData());
  req.session.employmentGather[req.session.editIndex] = employmentData;
  clearEmploymentJourneyData(req);
  req.journeyData.setDataForPage('employed', {
    screen: 'employed-other',
    other: 'no',
  });
};

// Add the latest instance of employment to the gather array, and clear the employment journey data
const addEmploymentToGather = (req) => {
  appLogger.info('employmentDataUtils: addEmploymentToGather called');
  const employmentData = getEmploymentFromJourneyData(req.journeyData.getData());
  req.session.employmentGather = req.session.employmentGather || [];
  req.session.employmentGather.push(employmentData);
  clearEmploymentJourneyData(req);
};

module.exports = {
  getEmploymentFromJourneyData,
  populateEmploymentJourneyData,
  clearEmploymentJourneyData,
  updateSpecificEmployment,
  addEmploymentToGather,
};
