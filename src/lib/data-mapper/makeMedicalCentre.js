import Logger from '../logger.js';

const appLogger = Logger();

/**
 * Build the medical centre part of the data structure.
 *
 * @param {object} medicalCentre Medical centre page data.
 * @returns {object} Object.
 */
export default (medicalCentre) => {
  appLogger.info('makeMedicalCentre');
  const medCentre = {
    name: medicalCentre.name,
    tel: medicalCentre.phoneNumber && medicalCentre.phoneNumber.replace(/\s/g, ''),
    address: {
      lines: [
        medicalCentre.address.address1,
        medicalCentre.address.address2,
        medicalCentre.address.address3,
      ],
      premises: '',
      postcode: medicalCentre.address.postcode,
    },
  };
  if (medicalCentre.doctor) {
    medCentre.doctor = medicalCentre.doctor;
  }
  return medCentre;
};
