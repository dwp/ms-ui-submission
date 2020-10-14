const Logger = require('../Logger');

const appLogger = Logger();

const getPensionFromJourneyData = (journeyData) => {
  appLogger.info('pensionDataUtils: getPensionFromJourneyData called');
  const pensionData = {
    pensionProvider: journeyData['pension-details'] ? journeyData['pension-details'].pensionProvider : '',
    providerRef: journeyData['pension-details'] ? journeyData['pension-details'].providerRef : '',
    providerTel: journeyData['pension-details'] ? journeyData['pension-details'].providerTel : '',
    providerAddress: {
      address1: journeyData['pension-details'] ? journeyData['pension-details'].providerAddress.address1 : '',
      address2: journeyData['pension-details'] ? journeyData['pension-details'].providerAddress.address2 : '',
      address3: journeyData['pension-details'] ? journeyData['pension-details'].providerAddress.address3 : '',
      postcode: journeyData['pension-details'] ? journeyData['pension-details'].providerAddress.postcode : '',
    },
    pensionStartDate: journeyData['pension-start'] ? journeyData['pension-start'].pensionStartDate : '',
    deductions: journeyData['pension-deductions'] ? journeyData['pension-deductions'].deductions : '',
    frequency: journeyData['pension-frequency'] ? journeyData['pension-frequency'].frequency : '',
    inherited: journeyData['pension-inherited'] ? journeyData['pension-inherited'].inherited : '',
  };

  if (pensionData.deductions === 'yes') {
    appLogger.info('Pension deductions');
    pensionData.deductionsDetails = journeyData['pension-deductions-details'] ? journeyData['pension-deductions-details'].deductionsDetails : '';
    pensionData.amountBeforeDeductions = journeyData['pension-payment'] ? journeyData['pension-payment'].amountBeforeDeductions : '';
    pensionData.amountAfterDeductions = journeyData['pension-payment'] ? journeyData['pension-payment'].amountAfterDeductions : '';
  } else {
    appLogger.info('No pension deductions');
    pensionData.amount = journeyData['pension-payment'] ? journeyData['pension-payment'].amount : '';
  }

  return pensionData;
};

const populatePensionJourneyData = (journeyData, data) => {
  appLogger.info('pensionDataUtils: populatePensionJourneyData called');
  journeyData.setDataForPage('pension-details', {
    pensionProvider: data.pensionProvider,
    providerRef: data.providerRef,
    providerTel: data.providerTel,
    providerAddress: data.providerAddress,
  });
  journeyData.setDataForPage('pension-start', {
    pensionStartDate: data.pensionStartDate,
  });
  journeyData.setDataForPage('pension-deductions', {
    deductions: data.deductions,
  });
  journeyData.setDataForPage('pension-frequency', {
    frequency: data.frequency,
  });
  journeyData.setDataForPage('pension-inherited', {
    inherited: data.inherited,
  });
  if (data.deductions === 'yes') {
    appLogger.info('Pension deductions');
    journeyData.setDataForPage('pension-deductions-details', {
      deductionsDetails: data.deductionsDetails,
    });
    journeyData.setDataForPage('pension-payment', {
      amountBeforeDeductions: data.amountBeforeDeductions,
      amountAfterDeductions: data.amountAfterDeductions,
    });
  } else {
    appLogger.info('No pension deductions');
    journeyData.setDataForPage('pension-payment', {
      amount: data.amount,
    });
  }
  journeyData.setDataForPage('pension', {
    screen: 'pension-other',
    other: 'yes',
  });
};

const clearPensionJourneyData = (req) => {
  appLogger.info('pensionDataUtils: clearPensionJourneyData called');
  req.journeyData.setDataForPage('pension', undefined);
  req.journeyData.setDataForPage('pension-details', undefined);
  req.journeyData.setDataForPage('pension-start', undefined);
  req.journeyData.setDataForPage('pension-frequency', undefined);
  req.journeyData.setDataForPage('pension-deductions', undefined);
  req.journeyData.setDataForPage('pension-deductions-details', undefined);
  req.journeyData.setDataForPage('pension-payment', undefined);
  req.journeyData.setDataForPage('pension-inherited', undefined);
};

// Update a specific instance of pension in the gather, and clear the pension journey data
// ready for another to be gathered
const updateSpecificPension = (req) => {
  appLogger.info('pensionDataUtils: updateSpecificPension called');
  const pensionData = getPensionFromJourneyData(req.journeyData.getData());
  req.session.pensionGather[req.session.editIndex] = pensionData;
  clearPensionJourneyData(req);
  req.journeyData.setDataForPage('pension', {
    screen: 'pension-other',
    other: 'no',
  });
};

// Add the latest instance of pension to the gather array, and clear the pension journey data
const addPensionToGather = (req) => {
  appLogger.info('pensionDataUtils: addPensionToGather called');
  const pensionData = getPensionFromJourneyData(req.journeyData.getData());
  req.session.pensionGather = req.session.pensionGather || [];
  req.session.pensionGather.push(pensionData);
  clearPensionJourneyData(req);
};

module.exports = {
  getPensionFromJourneyData,
  populatePensionJourneyData,
  clearPensionJourneyData,
  updateSpecificPension,
  addPensionToGather,
};
