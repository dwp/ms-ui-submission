import Logger from '../logger.js';
import formatDigit from '../../../app/utils/formatDigit.js';
const appLogger = Logger();

/**
 * Build the Applicant part of the data structure.
 *
 * @param {object} JourneyContext Containing page data.
 * @param journeyContext
 * @returns {object} Applicant object.
 */
export default (journeyContext) => {
  appLogger.info('makeApplicant');
  const name = journeyContext.name;
  const dob = journeyContext['date-of-birth'].dateOfBirth;
  const address = journeyContext.address;
  const mobile = journeyContext.mobile;
  const otherNumber = journeyContext['other-number'];

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
      data: mobile.number && mobile.number.replace(/\s/g, ''),
      preferred: true,
    });
  }

  if (mobile.mobile === 'no' && otherNumber.other === 'yes') {
    applicant.contact_options.push({
      method: 'tel',
      data: otherNumber.number && otherNumber.number.replace(/\s/g, ''),
      preferred: true,
    });
  }

  return applicant;
};
