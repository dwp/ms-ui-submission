const Logger = require('../Logger');

const appLogger = Logger();

/**
 * Build the voluntary work gather part of the data structure.
 *
 * @param {array} voluntaryGather details
 * @return {array} voluntary work details
 */
module.exports = (voluntaryGather) => {
  appLogger.info('makeVoluntary');
  return voluntaryGather.map((vol) => {
    const voluntary = {
      organisation_name: vol.organisationName,
      organisation_address: {
        lines: [
          vol.organisationAddress.address1,
          vol.organisationAddress.address2,
          vol.organisationAddress.address3,
        ],
        premises: '',
        postcode: vol.organisationAddress.postcode,
      },
      role: vol.role,
    };
    voluntary.same_hours = vol.sameHours;
    if (vol.sameHours === 'yes') {
      voluntary.hours = parseInt(vol.hours, 10).toString();
    }
    return voluntary;
  });
};
