import logger from '../logger.js';
import { JourneyContext } from '@dwp/govuk-casa';
import saveJourneyContext from './saveJourneyContext.js';

const appLogger = logger();

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

const populateVoluntaryJourneyData = (req, journeyContext, data, res, next, page) => {
  appLogger.info('voluntaryDataUtils: populateVoluntaryJourneyData called');
  journeyContext.setDataForPage('voluntary-work-details', {
    organisationName: data.organisationName,
    organisationAddress: data.organisationAddress,
  });
  journeyContext.setDataForPage('voluntary-work-role', {
    role: data.role,
  });
  const hoursData = {
    sameHours: data.sameHours,
  };
  if (data.sameHours === 'yes') {
    hoursData.hours = data.hours;
  }
  journeyContext.setDataForPage('voluntary-work-hours', hoursData);
  journeyContext.setDataForPage('voluntary-work', {
    screen: 'voluntary-work-other',
    other: 'yes',
  });
  saveJourneyContext(req, res, next, page);
};

const clearVoluntaryJourneyData = (req, cya = false) => {
  appLogger.info('voluntaryDataUtils: clearVoluntaryJourneyData called');
  req.casa.journeyContext.setDataForPage('voluntary-work', Object.create(null));
  if (cya) {
    const noEmploymentGather = req.session.voluntaryGather === undefined || req.session.voluntaryGather.length === 0;
    req.casa.journeyContext.setDataForPage('voluntary-work', {
      screen: noEmploymentGather ? 'voluntary-work' : 'voluntary-work-other',
      other: 'no',
    });
  }
  req.casa.journeyContext.setDataForPage('voluntary-work-details', Object.create(null));
  req.casa.journeyContext.setDataForPage('voluntary-work-role', Object.create(null));
  req.casa.journeyContext.setDataForPage('voluntary-work-hours', Object.create(null));
};

// Update a specific instance of voluntary organisation in the gather, and clear the voluntary
// journey data ready for another to be gathered
const updateSpecificVoluntary = (req) => {
  appLogger.info('voluntaryDataUtils: updateSpecificVoluntary called');
  const organisationData = getVoluntaryFromJourneyData(req.casa.journeyContext.data);
  req.session.voluntaryGather[req.session.editIndex] = organisationData;
  clearVoluntaryJourneyData(req);
  req.casa.journeyContext.setDataForPage('voluntary-work', {
    screen: 'voluntary-work-other',
    other: 'no',
  });
  JourneyContext.putContext(req.session, req.casa.journeyContext);
  return req.session.save();
};

// Add the latest instance of voluntary organisation to the gather array, and clear the voluntary
// organisation journey data
const addVoluntaryToGather = (req) => {
  appLogger.info('voluntaryDataUtils: addVoluntaryToGather called');
  const organisationData = getVoluntaryFromJourneyData(req.casa.journeyContext.data);
  req.session.voluntaryGather = req.session.voluntaryGather || [];
  req.session.voluntaryGather.push(organisationData);
  clearVoluntaryJourneyData(req);
};

export default {
  getVoluntaryFromJourneyData,
  populateVoluntaryJourneyData,
  clearVoluntaryJourneyData,
  updateSpecificVoluntary,
  addVoluntaryToGather,
};
