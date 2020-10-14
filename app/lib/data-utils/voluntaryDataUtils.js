const Logger = require('../Logger');

const appLogger = Logger();

const getVoluntaryFromJourneyData = (journeyData) => {
  appLogger.info('voluntaryDataUtils: getVoluntaryFromJourneyData called');
  const organisationData = {
    organisationName: journeyData['voluntary-work-details'] ? journeyData['voluntary-work-details'].organisationName : '',
    organisationAddress: {
      address1: journeyData['voluntary-work-details'] ? journeyData['voluntary-work-details'].organisationAddress.address1 : '',
      address2: journeyData['voluntary-work-details'] ? journeyData['voluntary-work-details'].organisationAddress.address2 : '',
      address3: journeyData['voluntary-work-details'] ? journeyData['voluntary-work-details'].organisationAddress.address3 : '',
      postcode: journeyData['voluntary-work-details'] ? journeyData['voluntary-work-details'].organisationAddress.postcode : '',
    },
    role: journeyData['voluntary-work-role'] ? journeyData['voluntary-work-role'].role : '',
    sameHours: journeyData['voluntary-work-hours'] ? journeyData['voluntary-work-hours'].sameHours : '',
  };
  if (journeyData['voluntary-work-hours'] && journeyData['voluntary-work-hours'].sameHours === 'yes') {
    organisationData.hours = journeyData['voluntary-work-hours'] ? journeyData['voluntary-work-hours'].hours : '';
  }
  return organisationData;
};

const populateVoluntaryJourneyData = (journeyData, data) => {
  appLogger.info('voluntaryDataUtils: populateVoluntaryJourneyData called');
  journeyData.setDataForPage('voluntary-work-details', {
    organisationName: data.organisationName,
    organisationAddress: data.organisationAddress,
  });
  journeyData.setDataForPage('voluntary-work-role', {
    role: data.role,
  });
  const hoursData = {
    sameHours: data.sameHours,
  };
  if (data.sameHours === 'yes') {
    hoursData.hours = data.hours;
  }
  journeyData.setDataForPage('voluntary-work-hours', hoursData);
  journeyData.setDataForPage('voluntary-work', {
    screen: 'voluntary-work-other',
    other: 'yes',
  });
};

const clearVoluntaryJourneyData = (req) => {
  appLogger.info('voluntaryDataUtils: clearVoluntaryJourneyData called');
  req.journeyData.setDataForPage('voluntary-work', undefined);
  req.journeyData.setDataForPage('voluntary-work-details', undefined);
  req.journeyData.setDataForPage('voluntary-work-role', undefined);
  req.journeyData.setDataForPage('voluntary-work-hours', undefined);
};

// Update a specific instance of voluntary organisation in the gather, and clear the voluntary
// journey data ready for another to be gathered
const updateSpecificVoluntary = (req) => {
  appLogger.info('voluntaryDataUtils: updateSpecificVoluntary called');
  const organisationData = getVoluntaryFromJourneyData(req.journeyData.getData());
  req.session.voluntaryGather[req.session.editIndex] = organisationData;
  clearVoluntaryJourneyData(req);
  req.journeyData.setDataForPage('voluntary-work', {
    screen: 'voluntary-work-other',
    other: 'no',
  });
};

// Add the latest instance of voluntary organisation to the gather array, and clear the voluntary
// organisation journey data
const addVoluntaryToGather = (req) => {
  appLogger.info('voluntaryDataUtils: addVoluntaryToGather called');
  const organisationData = getVoluntaryFromJourneyData(req.journeyData.getData());
  req.session.voluntaryGather = req.session.voluntaryGather || [];
  req.session.voluntaryGather.push(organisationData);
  clearVoluntaryJourneyData(req);
};

module.exports = {
  getVoluntaryFromJourneyData,
  populateVoluntaryJourneyData,
  clearVoluntaryJourneyData,
  updateSpecificVoluntary,
  addVoluntaryToGather,
};
