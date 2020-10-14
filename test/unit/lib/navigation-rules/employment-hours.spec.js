const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { employmentDataUtils, genericDataUtils } = require('../../../../app/lib/data-utils');
const employmentHours = require('../../../../app/lib/navigation-rules/employment-hours');

describe('employment hours navigation rules', () => {
  let req;
  let clearEmploymentJourneyData;
  let updateSpecificEmployment;
  let deleteIfPresent;

  afterEach(() => {
    clearEmploymentJourneyData.restore();
    updateSpecificEmployment.restore();
    deleteIfPresent.restore();
  });

  beforeEach(() => {
    clearEmploymentJourneyData = sinon.stub(employmentDataUtils, 'clearEmploymentJourneyData');
    updateSpecificEmployment = sinon.stub(employmentDataUtils, 'updateSpecificEmployment');
    deleteIfPresent = sinon.stub(genericDataUtils, 'deleteIfPresent');
    req = {
      journeyData: {
        getDataForPage: (p) => req.journeyData.data[p],
        data: {
          expenses: 'no',
          'employment-hours': { sameHours: 'yes', hours: '' },
          'employment-pay-frequency-samehours': { frequency: 'some data', netPay: 'some data' },
          'employment-pay-frequency-other': { frequency: 'some data', netPay: 'some data' },
        },
        getData: sinon.stub(),
        setDataForPage: sinon.stub().returns('something'),
      },
      session: {
        editPage: 'employment-hours',
        editIndex: 0,
        save: sinon.stub().yields(),
        employmentGather: [{
          sameHours: 'yes',
          hours: '',
        }],
      },
    };
  });

  describe('edit page equals employment hours', () => {
    describe('and old same hours and hours and new same hours and hours are the same', () => {
      beforeEach(() => {
        employmentHours(req);
      });
      it('should call clearEmploymentJourneyData', () => {
        assert(clearEmploymentJourneyData.called);
      });
      it('should call setDataForPage', () => {
        assert(req.journeyData.setDataForPage.called);
      });
    });
    describe('and one of old or new sameHours or hours does not match', () => {
      describe('and there is a material change to sameHours', () => {
        it('should set new hours to an empty string if newSameHours is no', () => {
          req.session.employmentGather[req.session.editIndex].sameHours = 'yes'; // old same hours.
          req.session.employmentGather[req.session.editIndex].hours = '2'; // old hours.
          req.journeyData.data['employment-hours'].sameHours = 'no'; // new same hours.
          req.journeyData.data['employment-hours'].hours = '1'; // new hours.
          employmentHours(req);
          assert.equal(req.journeyData.data['employment-hours'].hours, '');
        });
        it('should delete session data for the 2 pay frequency screens when oldSameHours is yes and newSameHours is yes and oldHours is 0 and newHours is > 0 .', () => {
          req.session.employmentGather[req.session.editIndex].sameHours = 'yes'; // old same hours.
          req.session.employmentGather[req.session.editIndex].hours = '0'; // old hours.
          req.journeyData.data['employment-hours'].sameHours = 'yes'; // new same hours.
          req.journeyData.data['employment-hours'].hours = '1'; // new hours.
          employmentHours(req);
          assert(deleteIfPresent.calledTwice);
        });
        it('should delete session data for the 2 pay frequency screens when oldSameHours is yes and old hours is > 0 and newSameHours is no.', () => {
          req.session.employmentGather[req.session.editIndex].sameHours = 'yes'; // old same hours.
          req.session.employmentGather[req.session.editIndex].hours = '10'; // old hours.
          req.journeyData.data['employment-hours'].sameHours = 'no'; // new same hours.
          employmentHours(req);
          assert(deleteIfPresent.calledTwice);
        });
        it('should delete session data for the 2 pay frequency screens when oldSameHours is no and newSameHours is yes and and newHours is > 0 .', () => {
          req.session.employmentGather[req.session.editIndex].sameHours = 'no'; // old same hours.
          req.journeyData.data['employment-hours'].sameHours = 'yes'; // new same hours.
          req.journeyData.data['employment-hours'].hours = '1'; // new hours.
          employmentHours(req);
          assert(deleteIfPresent.calledTwice);
        });
        it('should delete session data for the 2 pay frequency screens when oldSameHours is yes and newSameHours is yes and and newHours is 0 and oldHours contains a positive value.', () => {
          req.session.employmentGather[req.session.editIndex].sameHours = 'yes'; // old same hours.
          req.journeyData.data['employment-hours'].sameHours = 'yes'; // new same hours.
          req.journeyData.data['employment-hours'].hours = '0'; // new hours.
          req.session.employmentGather[req.session.editIndex].hours = '1'; // old hours.
          employmentHours(req);
          assert(deleteIfPresent.calledTwice);
        });
      });
      describe('and there is no material change to sameHours', () => {
        it('should call updateSingleEmployment when oldSameHours is no and new same hours is yes and new hours is 0', () => {
          req.session.employmentGather[req.session.editIndex].sameHours = 'no'; // old same hours.
          req.journeyData.data['employment-hours'].sameHours = 'yes'; // new same hours.
          req.journeyData.data['employment-hours'].hours = '0'; // new hours.
          employmentHours(req);
          assert(updateSpecificEmployment.called);
        });
        it('should call updateSingleEmployment when oldSameHours is yes and oldHours is 0 and new same hours is no', () => {
          req.session.employmentGather[req.session.editIndex].sameHours = 'yes'; // old same hours.
          req.session.employmentGather[req.session.editIndex].hours = '0'; // old hours.
          req.journeyData.data['employment-hours'].sameHours = 'no'; // new same hours.
          employmentHours(req);
          assert(updateSpecificEmployment.called);
        });
      });
    });
  });
  it('should do nothing if editPage is not employment-hours', () => {
    req.session.editPage = '';
    employmentHours(req);
    assert(updateSpecificEmployment.notCalled);
    assert(deleteIfPresent.notCalled);
  });
});
