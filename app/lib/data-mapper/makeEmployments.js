const Logger = require('../Logger');
const formatDigit = require('../../utils/formatDigit');

const appLogger = Logger();

/**
 * Build the employments gather part of the data structure.
 *
 * @param {array} employmentGather details
 * @return {array} paid work details
 */
module.exports = (employmentGather) => {
  appLogger.info('makeEmployments');
  return employmentGather.map((emp) => {
    const employment = {
      job_title: emp.jobTitle,
      employer_name: emp.employerName,
      employer_tel: emp.employerTel,
      employer_address: {
        lines: [
          emp.employerAddress.address1,
          emp.employerAddress.address2,
          emp.employerAddress.address3,
        ],
        premises: '',
        postcode: emp.employerAddress.postcode,
      },
      employment_status: emp.workTypes,
    };
    employment.off_sick = emp.offSick;
    if (emp.offSick === 'yes') {
      employment.last_worked_date = `${emp.lastWorkedDate.yyyy}-${formatDigit(emp.lastWorkedDate.mm)}-${formatDigit(emp.lastWorkedDate.dd)}`;
    } else {
      employment.same_hours = emp.sameHours;
      if (emp.sameHours === 'yes') {
        employment.hours = emp.hours;
      }
      employment.net_pay = emp.netPay;
      employment.frequency = emp.frequency;
      employment.support = emp.support;
      employment.expenses_question = emp.expenses;
      if (emp.expenses === 'yes') {
        employment.expenses_details = emp.expensesDetails;
      }
    }
    return employment;
  });
};
