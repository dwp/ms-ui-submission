const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { genericDataUtils } = require('../../../../app/lib/data-utils');
const hospitalInpatient = require('../../../../app/lib/navigation-rules/hospital-inpatient');

describe('hospital-inpatient navigation rules', () => {
  let req;
  let deleteIfPresent;
  const page = 'hospital-inpatient';
  const fieldNames = ['hospitalName', 'hospitalWard', 'admissionDate'];

  beforeEach(() => {
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    req = {};
  });

  afterEach(() => {
    deleteIfPresent.restore();
  });
  it('should empty hospital details if hospital-inpatient is changed to no', () => {
    req.journeyData = {
      getDataForPage: () => ({
        hospitalInpatient: 'no',
      }),
    };
    hospitalInpatient(req);
    assert(deleteIfPresent.calledOnce);
    assert(deleteIfPresent.calledWith(req, page, fieldNames));
  });
  it('should not empty hospital details if hospital-inpatient is changed to yes', () => {
    req.journeyData = {
      getDataForPage: () => ({
        hospitalInpatient: 'yes',
      }),
    };
    hospitalInpatient(req);
    assert(deleteIfPresent.notCalled);
  });
});
