const Logger = require('../Logger');
const formatDigit = require('../../utils/formatDigit');

const appLogger = Logger();

/**
 * Build the Applicant part of the data structure.
 *
 * @param {object} journeyData containing page data
 * @return {object} applicant object
 */
module.exports = (journeyData) => {
  appLogger.info('makeApplicant');
  const name = journeyData.getDataForPage('name');
  const dob = journeyData.getDataForPage('date-of-birth').dateOfBirth;
  const address = journeyData.getDataForPage('address');
  const mobile = journeyData.getDataForPage('mobile');
  const otherNumber = journeyData.getDataForPage('other-number');

  const applicant = {
    forenames: name.firstName,
    surname: name.lastName,
    dob: `${dob.yyyy}-${formatDigit(dob.mm)}-${formatDigit(dob.dd)}`,
    residence_address: {
      lines: [
        address.address.address1,
        address.address.address2,
        address.address.address3,
      ],
      premises: '',
      postcode: address.address.postcode,
    },
    contact_options: [],
  };

  if (mobile.mobile === 'yes') {
    applicant.contact_options.push({
      method: 'telmobile',
      data: mobile.number,
      preferred: true,
    });
  }

  if (mobile.mobile === 'no' && otherNumber.other === 'yes') {
    applicant.contact_options.push({
      method: 'tel',
      data: otherNumber.number,
      preferred: true,
    });
  }
  return applicant;
};
