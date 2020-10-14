const Logger = require('../Logger');

const appLogger = Logger();

/**
 * Build the medical centre part of the data structure.
 *
 * @param {object} medicalCentre medical centre page data
 * @return {object} object
 */
module.exports = (medicalCentre) => {
  appLogger.info('makeMedicalCentre');
  const medCentre = {
    name: medicalCentre.name,
    tel: medicalCentre.phoneNumber,
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
