const Logger = require('../Logger');

const appLogger = Logger();

const getInsuranceFromJourneyData = (journeyData) => {
  appLogger.info('insuranceDataUtils: getInsuranceFromJourneyData called');
  const insuranceData = {
    insuranceProvider: journeyData['insurance-details'] ? journeyData['insurance-details'].insuranceProvider : '',
    providerRef: journeyData['insurance-details'] ? journeyData['insurance-details'].providerRef : '',
    providerTel: journeyData['insurance-details'] ? journeyData['insurance-details'].providerTel : '',
    providerAddress: {
      address1: journeyData['insurance-details'] ? journeyData['insurance-details'].providerAddress.address1 : '',
      address2: journeyData['insurance-details'] ? journeyData['insurance-details'].providerAddress.address2 : '',
      address3: journeyData['insurance-details'] ? journeyData['insurance-details'].providerAddress.address3 : '',
      postcode: journeyData['insurance-details'] ? journeyData['insurance-details'].providerAddress.postcode : '',
    },
    amount: journeyData['insurance-payment'] ? journeyData['insurance-payment'].amount : '',
    premiums: journeyData['insurance-premiums'] ? journeyData['insurance-premiums'].premiums : '',
  };
  if (journeyData['insurance-payment'] && journeyData['insurance-payment'].frequency) {
    insuranceData.frequency = journeyData['insurance-payment'].frequency;
  }
  if (insuranceData.premiums !== 'yes') {
    appLogger.info('Less than half the premiums paid');
    if (journeyData['insurance-employer'] && journeyData['insurance-employer'].stillWork) {
      insuranceData.stillWork = journeyData['insurance-employer'].stillWork;
      if (insuranceData.stillWork === 'no') {
        insuranceData.endDate = journeyData['insurance-employer'] ? journeyData['insurance-employer'].endDate : '';
      }
    }
  }
  return insuranceData;
};

/**
 *
 * @param {object} journeyData the journey data
 * @param {object} data the data that needs to be added to the journey
 * @param {boolean} dummyField This is a hack to force CASA to move past
 * a page that doesn't contain any data when attempting to edit
 * from the cya screen. i.e. if there is a page(1)
 * that has a single yes no answer that is non-mandatory,
 * and there is a page(2) after that page(1) in the loop, when attempting to edit page 2
 * CASA will force the redirect to page 1 because the page has no data on it.
 * @return {undefined} undefined
 */
const populateInsuranceJourneyData = (journeyData, data, dummyField = false) => {
  appLogger.info('insuranceDataUtils: populateInsuranceJourneyData called');
  journeyData.setDataForPage('insurance-details', {
    insuranceProvider: data.insuranceProvider,
    providerRef: data.providerRef,
    providerTel: data.providerTel,
    providerAddress: data.providerAddress,
  });
  journeyData.setDataForPage('insurance-payment', {
    frequency: data.frequency,
    amount: data.amount,
  });
  journeyData.setDataForPage('insurance-premiums', {
    premiums: data.premiums,
  });
  if (data.premiums !== 'yes') {
    appLogger.info('Less than half of premiums paid');
    const employerData = {
      stillWork: data.stillWork,
    };
    if (dummyField) {
      employerData.dummyField = 'someDummyDataToFoolCasa';
    }
    if (data.stillWork === 'no') {
      employerData.endDate = data.endDate;
    }
    journeyData.setDataForPage('insurance-employer', employerData);
  }
  journeyData.setDataForPage('insurance', {
    screen: 'insurance-other',
    other: 'yes',
  });
};

const clearInsuranceJourneyData = (req) => {
  appLogger.info('insuranceDataUtils: clearInsuranceJourneyData called');
  req.journeyData.setDataForPage('insurance', undefined);
  req.journeyData.setDataForPage('insurance-details', undefined);
  req.journeyData.setDataForPage('insurance-premiums', undefined);
  req.journeyData.setDataForPage('insurance-employer', undefined);
  req.journeyData.setDataForPage('insurance-payment', undefined);
};

// Update a specific instance of insurance in the gather, and clear the insurance journey data
// ready for another to be gathered
const updateSpecificInsurance = (req) => {
  appLogger.info('insuranceDataUtils: updateSpecificInsurance called');
  const insuranceData = getInsuranceFromJourneyData(req.journeyData.getData());
  req.session.insuranceGather[req.session.editIndex] = insuranceData;
  clearInsuranceJourneyData(req);
  req.journeyData.setDataForPage('insurance', {
    screen: 'insurance-other',
    other: 'no',
  });
};

// Add the latest instance of insurance to the gather array, and clear the insurance journey data
const addInsuranceToGather = (req) => {
  appLogger.info('insuranceDataUtils: addInsuranceToGather called');
  const insuranceData = getInsuranceFromJourneyData(req.journeyData.getData());
  req.session.insuranceGather = req.session.insuranceGather || [];
  req.session.insuranceGather.push(insuranceData);
  clearInsuranceJourneyData(req);
};

module.exports = {
  getInsuranceFromJourneyData,
  populateInsuranceJourneyData,
  clearInsuranceJourneyData,
  updateSpecificInsurance,
  addInsuranceToGather,
};
