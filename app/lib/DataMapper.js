const moment = require('moment');

const dataMapper = require('./data-mapper');

module.exports = (translator, journeyData, session, applicationRef) => ({
  msg_id: 'esa.submission.new',
  ref: applicationRef,
  date_submitted: moment().toISOString(),
  applicant: dataMapper.makeApplicant(journeyData),
  data_capture: dataMapper.makeDataCapture(translator, journeyData, session),
  declaration: dataMapper.makeDeclaration(translator),
  tags: [],
});
