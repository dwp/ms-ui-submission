import Logger from '../logger.js';
import formatDigit from '../../../app/utils/formatDigit.js';

const appLogger = Logger();

/**
 * Build the insurance gather part of the data structure.
 *
 * @param {Array} insuranceGather Details.
 * @returns {Array} Insurance details.
 */
export default (insuranceGather) => {
  appLogger.info('makeInsurance');
  return insuranceGather.map((ins) => {
    const insurance = {
      insurance_provider: ins.insuranceProvider,
      provider_ref: ins.providerRef,
      provider_tel: ins.providerTel,
      provider_address: {
        lines: [
          ins.providerAddress.address1,
          ins.providerAddress.address2,
          ins.providerAddress.address3,
        ],
        premises: '',
        postcode: ins.providerAddress.postcode,
      },
      amount: ins.amount,
      frequency: ins.frequency,
      premiums: ins.premiums,
    };
    if (ins.premiums !== 'yes' && ins.stillWork === 'no') {
      insurance.employment_end_date = `${ins.endDate.yyyy}-${formatDigit(ins.endDate.mm)}-${formatDigit(ins.endDate.dd)}`;
    }
    return insurance;
  });
};
