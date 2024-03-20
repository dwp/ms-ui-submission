import { DateTime } from 'luxon';
import dataMapper from './data-mapper/index.js';

export default (translator, journeyData, session, applicationRef) => ({
  msg_id: 'esa.submission.new',
  ref: applicationRef,
  date_submitted: DateTime.now(),
  applicant: dataMapper.makeApplicant(journeyData),
  data_capture: dataMapper.makeDataCapture(journeyData, session),
  declaration: dataMapper.makeDeclaration(translator),
  tags: [],
});
