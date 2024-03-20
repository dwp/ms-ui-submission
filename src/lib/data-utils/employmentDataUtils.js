import logger from '../logger.js';
import { JourneyContext } from '@dwp/govuk-casa';
import saveJourneyContext from './saveJourneyContext.js';

const appLogger = logger();

const getEmploymentFromJourneyData = (journeyData) => {
  appLogger.info('employmentDataUtils: getEmploymentFromJourneyData called');
  const isSelfEmployed = journeyData['employment-status']?.workTypes.includes('selfEmployed');
  const employmentData = isSelfEmployed ? {
    selfEmployed: true,
    jobTitle: journeyData['self-employment-details'] ? journeyData['self-employment-details'].jobTitle : '',
    employerName: journeyData['self-employment-details'] ? journeyData['self-employment-details'].employerName : '',
    employerTel: journeyData['self-employment-details'] ? journeyData['self-employment-details'].employerTel : '',
    employerAddress: {
      address1: journeyData['self-employment-details'] ? journeyData['self-employment-details'].employerAddress.address1 : '',
      address2: journeyData['self-employment-details'] ? journeyData['self-employment-details'].employerAddress.address2 : '',
      address3: journeyData['self-employment-details'] ? journeyData['self-employment-details'].employerAddress.address3 : '',
      postcode: journeyData['self-employment-details'] ? journeyData['self-employment-details'].employerAddress.postcode : '',
    },
    offSick: journeyData['employment-off-sick'] ? journeyData['employment-off-sick'].offSick : '',
    workTypes: journeyData['employment-status'] && Array.isArray(journeyData['employment-status'].workTypes)
      ? journeyData['employment-status'].workTypes : [journeyData['employment-status'].workTypes],
  } : {
    selfEmployed: false,
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
      ? journeyData['employment-status'].workTypes : [journeyData['employment-status']?.workTypes],
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

const populateEmploymentJourneyData = (req, journeyContext, data, res, next, page) => {
  appLogger.info('employmentDataUtils: populateEmploymentJourneyData called');
  const isSelfEmployed = data.workTypes.includes('selfEmployed');
  journeyContext.setDataForPage('employed', {
    screen: 'employed-other',
    other: 'yes',
    employed: 'yes',
  });
  if (isSelfEmployed) {
    journeyContext.setDataForPage('self-employment-details', {
      jobTitle: data.jobTitle,
      employerName: data.employerName,
      employerTel: data.employerTel,
      employerAddress: data.employerAddress,
    });
  } else {
    journeyContext.setDataForPage('employment-details', {
      jobTitle: data.jobTitle,
      employerName: data.employerName,
      employerTel: data.employerTel,
      employerAddress: data.employerAddress,
    });
  }
  journeyContext.setDataForPage('employment-off-sick', {
    offSick: data.offSick,
  });
  journeyContext.setDataForPage('employment-status', {
    workTypes: data.workTypes,
  });
  if (data.offSick === 'yes') {
    appLogger.info('offSick journey');
    journeyContext.setDataForPage('employment-last-work', {
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
    journeyContext.setDataForPage('employment-hours', hoursData);
    const payFrequency = {
      frequency: data.frequency,
      netPay: data.netPay,
    };
    if (data.hours && data.hours > 0) {
      journeyContext.setDataForPage('employment-pay-frequency-samehours', payFrequency);
    } else {
      journeyContext.setDataForPage('employment-pay-frequency-other', payFrequency);
    }
    journeyContext.setDataForPage('employment-support', {
      support: data.support,
    });
    journeyContext.setDataForPage('employment-expenses', {
      expenses: data.expenses,
    });
    if (data.expenses === 'yes') {
      journeyContext.setDataForPage('employment-expenses-details', {
        expensesDetails: data.expensesDetails,
      });
    }
  }

  const employedOption = req.casa.journeyContext.data.employed || null;
  const employmentNumber = req.session.employmentGather && req.session.employmentGather.length ? req.session.employmentGather.length : 0;
  const employedAnswer = employmentNumber > 0 ? employedOption.other : employedOption.employed;
  const screen = employmentNumber > 0 ? 'employed-other' : 'employed';

  req.casa.journeyContext.setDataForPage('employed', {
    employed: employedAnswer,
    other: employedAnswer,
    screen,
  });
  saveJourneyContext(req, res, next, page);
};

const clearEmploymentJourneyData = (req, cya = false) => {
  appLogger.info('employmentDataUtils: clearEmploymentJourneyData called');
  req.casa.journeyContext.setDataForPage('employed', Object.create(null));
  if (cya) {
    const noEmploymentGather = req.session.employmentGather === undefined || req.session.employmentGather.length === 0;
    req.casa.journeyContext.setDataForPage('employed', {
      screen: noEmploymentGather ? 'employed' : 'employed-other',
      other: 'no',
      employed: 'no',
    });
  }
  req.casa.journeyContext.setDataForPage('employment-details', Object.create(null));
  req.casa.journeyContext.setDataForPage('self-employment-details', Object.create(null));
  req.casa.journeyContext.setDataForPage('employment-off-sick', Object.create(null));
  req.casa.journeyContext.setDataForPage('employment-last-work', Object.create(null));
  req.casa.journeyContext.setDataForPage('employment-status', Object.create(null));
  req.casa.journeyContext.setDataForPage('employment-hours', Object.create(null));
  req.casa.journeyContext.setDataForPage('employment-pay-frequency-samehours', Object.create(null));
  req.casa.journeyContext.setDataForPage('employment-pay-frequency-other', Object.create(null));
  req.casa.journeyContext.setDataForPage('employment-support', Object.create(null));
  req.casa.journeyContext.setDataForPage('employment-expenses', Object.create(null));
  req.casa.journeyContext.setDataForPage('employment-expenses-details', Object.create(null));
  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save();
};

// Update a specific instance of employment in the gather, and clear the employment journey data
// ready for another to be gathered
const updateSpecificEmployment = (payload, req) => {
  appLogger.info('employmentDataUtils: updateSpecificEmployment called');
  const employmentData = getEmploymentFromJourneyData(payload);
  const index = req.session.editIndex ? req.session.editIndex : req.session.employmentGather.length;
  req.session.employmentGather[index] = employmentData;
  req.casa.journeyContext.data['employed', {
    screen: 'employed-other',
    other: 'no',
    employed: 'no',
  }];
  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save();
};

// Add the latest instance of employment to the gather array, and clear the employment journey data
const addEmploymentToGather = (payload, req) => {
  appLogger.info('employmentDataUtils: addEmploymentToGather called');
  const employmentData = getEmploymentFromJourneyData(payload);
  req.session.employmentGather = req.session.employmentGather || [];
  req.session.employmentGather.push(employmentData);
  clearEmploymentJourneyData(req);
};

const getEmployerName = (req) => (req.casa.journeyContext.data.data['employment-status'].workTypes.includes('selfEmployed')
  ? req.casa.journeyContext.data.data['self-employment-details']
    .employerName : req.casa.journeyContext.data.data['employment-details'].employerName);

export default {
  getEmploymentFromJourneyData,
  populateEmploymentJourneyData,
  clearEmploymentJourneyData,
  updateSpecificEmployment,
  addEmploymentToGather,
  getEmployerName,
};
