const Logger = require('../Logger');
const formatDigit = require('../../utils/formatDigit');

const appLogger = Logger();

/**
 * Build the pensions gather part of the data structure.
 *
 * @param {array} pensionGather details
 * @return {array} pensions details
 */
module.exports = (pensionGather) => {
  appLogger.info('makePensions');
  return pensionGather.map((pen) => {
    let startDate;
    if (pen.pensionStartDate.mm.length === 0) {
      startDate = '';
    } else {
      startDate = `${pen.pensionStartDate.yyyy}-${formatDigit(pen.pensionStartDate.mm)}-${formatDigit(pen.pensionStartDate.dd)}`;
    }
    const pension = {
      pension_provider: pen.pensionProvider,
      provider_ref: pen.providerRef,
      provider_tel: pen.providerTel,
      provider_address: {
        lines: [
          pen.providerAddress.address1,
          pen.providerAddress.address2,
          pen.providerAddress.address3,
        ],
        premises: '',
        postcode: pen.providerAddress.postcode,
      },
      start_date: startDate,
      deductions: pen.deductions,
      amount_gross: (pen.deductions === 'yes') ? pen.amountBeforeDeductions : pen.amount,
      frequency: pen.frequency,
      inherited: pen.inherited,
    };
    pension.deductions = pen.deductions;
    if (pen.deductions === 'yes') {
      pension.amount_net = pen.amountAfterDeductions;
      pension.deduction_details = pen.deductionsDetails;
    }
    return pension;
  });
};
