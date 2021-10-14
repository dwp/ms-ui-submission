const chai = require('chai');
const sinon = require('sinon');

const { assert, expect } = chai;
const {
  employmentDataUtils, genericDataUtils, voluntaryDataUtils, conditionDataUtils,
} = require('../../../../app/lib/data-utils');
const navigationOverride = require('../../../../app/middleware/navigation-override/navigation-override.js');
const sectionPages = require('../../../../app/lib/section-pages');

describe('Navigation override', () => {
  it('should cancel the edit if we are editing, the target is cya and the cyaBackNavigationFlag is true', () => {
    const req = {
      session: {
        editing: true,
        cyaBackNavigationFlag: true,
        save: sinon.stub().yields(),
      },
      path: '/check-your-answers',
    };
    const cancelEdit = sinon.stub(genericDataUtils, 'cancelEdit');
    const next = sinon.stub();
    navigationOverride(req, null, next);
    assert(cancelEdit.calledOnce);
    expect(req.session.previousPage).to.equal('check-your-answers');
    assert(req.session.save.calledOnce);
    assert(next.calledOnce);
    cancelEdit.restore();
  });
  describe('normal journey back navigation', () => {
    let req;
    let next;
    beforeEach(() => {
      req = {
        session: {
          editing: true,
          backNavigationFlag: true,
          save: sinon.stub().yields(),
        },
        journeyData: {
          setDataForPage: sinon.stub(),
        },
      };
      next = sinon.stub();
    });
    it('should remove the last gather from the condition gather array and put it in the journey', () => {
      const populateConditionJourneyData = sinon.stub(conditionDataUtils, 'populateConditionJourneyData');
      req.session.conditionGather = ['condition test'];
      req.path = '/email';
      navigationOverride(req, null, next);
      assert(populateConditionJourneyData.calledOnce);
      assert(next.calledOnce);
      populateConditionJourneyData.restore();
    });
    it('should remove the entry from the condition journey data if the condition gather array is empty', () => {
      const clearConditionJourneyData = sinon.stub(conditionDataUtils, 'clearConditionJourneyData');
      req.session.conditionGather = [];
      req.path = '/email';
      navigationOverride(req, null, next);
      assert(clearConditionJourneyData.calledOnce);
      assert(next.calledOnce);
      clearConditionJourneyData.restore();
    });
    it('should remove the last gather from the voluntary gather array and put it in the journey', () => {
      const populateVoluntaryJourneyData = sinon.stub(voluntaryDataUtils, 'populateVoluntaryJourneyData');
      req.session.voluntaryGather = ['voluntary test'];
      req.path = '/voluntary-work-hours';
      navigationOverride(req, null, next);
      assert(populateVoluntaryJourneyData.calledOnce);
      assert(next.calledOnce);
      populateVoluntaryJourneyData.restore();
    });
    it('should remove the entry from the voluntary journey data if the voluntay gather array is empty', () => {
      const clearVoluntaryJourneyData = sinon.stub(voluntaryDataUtils, 'clearVoluntaryJourneyData');
      req.session.voluntaryGather = [];
      req.path = '/voluntary-work-hours';
      navigationOverride(req, null, next);
      assert(clearVoluntaryJourneyData.calledOnce);
      assert(next.calledOnce);
      clearVoluntaryJourneyData.restore();
    });
    it('should remove the last gather from the employment gather array and put it in the journey', () => {
      const populateEmploymentJourneyData = sinon.stub(employmentDataUtils, 'populateEmploymentJourneyData');
      req.session.employmentGather = ['employment test'];
      req.path = '/employment-expenses-details';
      navigationOverride(req, null, next);
      assert(populateEmploymentJourneyData.calledOnce);
      assert(next.calledOnce);
      populateEmploymentJourneyData.restore();
    });
    it('should remove the entry from the employment journey data if the employment gather array is empty', () => {
      const clearEmploymentJourneyData = sinon.stub(employmentDataUtils, 'clearEmploymentJourneyData');
      req.session.employmentGather = [];
      req.path = '/employment-expenses';
      navigationOverride(req, null, next);
      assert(clearEmploymentJourneyData.calledOnce);
      assert(next.calledOnce);
      clearEmploymentJourneyData.restore();
    });
    it('should remove the last gather from the employment gather array and put it in the journey', () => {
      const populateEmploymentJourneyData = sinon.stub(employmentDataUtils, 'populateEmploymentJourneyData');
      req.session.employmentGather = ['employment test'];
      req.path = '/employment-expenses';
      navigationOverride(req, null, next);
      assert(populateEmploymentJourneyData.calledOnce);
      assert(next.calledOnce);
      populateEmploymentJourneyData.restore();
    });
    it('should remove the last gather from the employment gather array and put it in the journey', () => {
      const populateEmploymentJourneyData = sinon.stub(employmentDataUtils, 'populateEmploymentJourneyData');
      req.session.employmentGather = ['employment test'];
      req.path = '/employment-last-work';
      navigationOverride(req, null, next);
      assert(populateEmploymentJourneyData.calledOnce);
      assert(next.calledOnce);
      populateEmploymentJourneyData.restore();
    });
    it('should remove the entry from the employment journey data if the employment gather array is empty', () => {
      const clearEmploymentJourneyData = sinon.stub(employmentDataUtils, 'clearEmploymentJourneyData');
      req.session.employmentGather = [];
      req.path = '/employment-last-work';
      navigationOverride(req, null, next);
      assert(clearEmploymentJourneyData.calledOnce);
      assert(next.calledOnce);
      clearEmploymentJourneyData.restore();
    });
  });
  describe('normal flag setting behaviour', () => {
    let req;
    let next;
    beforeEach(() => {
      req = {
        journeyData: {
          setDataForPage: sinon.stub(),
        },
        session: {
          anotherConditionBack: true,
          editing: true,
          backNavigationFlag: true,
          save: sinon.stub().yields(),
        },
      };
      next = sinon.stub();
    });
    it('should set the backNavigationFlag to true if the page is in \'conditions\', \'voluntary-work\', \'employed\', \'pension\', \'insurance\'', () => {
      req.path = '/conditions';
      navigationOverride(req, null, next);
      expect(req.session.backNavigationFlag).to.equal(true);
      req.path = '/voluntary-work';
      navigationOverride(req, null, next);
      expect(req.session.backNavigationFlag).to.equal(true);
      req.path = '/employed';
      navigationOverride(req, null, next);
      expect(req.session.backNavigationFlag).to.equal(true);
      req.path = '/another-path';
      navigationOverride(req, null, next);
      expect(req.session.backNavigationFlag).to.equal(false);
    });
    it('should set anotherConditionBack to false if anotherConditionBack is true', () => {
      req.path = '/another-path';
      navigationOverride(req, null, next);
      expect(req.session.anotherConditionBack).to.equal(false);
    });
    it('should set the backNavigationFlag to false if the page is not in \'voluntary-work\', \'employed\', \'pension\', \'insurance\'', () => {
      req.path = '/another-path';
      navigationOverride(req, null, next);
      expect(req.session.backNavigationFlag).to.equal(false);
    });
    it('should set the cyaBackNavigationFlag to true if the page is check-your-answers and the currentPage is one of the section pages', () => {
      Object.keys(sectionPages).forEach((val) => {
        req.session.previousPage = 'check-your-answers';
        req.path = `/${val}`;
        navigationOverride(req, null, next);
        expect(req.session.cyaBackNavigationFlag).to.equal(true);
      });
    });
  });
});
