const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { employmentDataUtils } = require('../../../../app/lib/data-utils');
const employmentExpenses = require('../../../../app/lib/navigation-rules/employment-expenses');

describe('employment expenses navigation rule', () => {
  let req;
  let res;
  let next;
  let updateSpecificEmployment;
  let addEmploymentToGather;

  afterEach(() => {
    updateSpecificEmployment.restore();
    addEmploymentToGather.restore();
  });

  beforeEach(() => {
    updateSpecificEmployment = sinon.stub(employmentDataUtils, 'updateSpecificEmployment');
    addEmploymentToGather = sinon.stub(employmentDataUtils, 'addEmploymentToGather');
    req = {
      journeyData: {
        getDataForPage: () => ({
          expenses: 'no',
        }),
        getData: () => ({
        }),
      },
      session: {
        save: sinon.stub().yields(),
      },
    };
    res = {
      status: sinon.stub().returns({
        redirect: sinon.stub(),
      }),
    };
    next = sinon.stub();
  });

  describe('when expenses = \'no\'', () => {
    describe('and the edit section equals \'employment\'', () => {
      it('should call DataUtils.updateSpecificEmployment', () => {
        req.session.editSection = 'employment';
        employmentExpenses(req, res, next);
        assert(updateSpecificEmployment.called);
      });
    });
    describe('and the edit section does not equal \'employment\'', () => {
      it('should call DataUtils.addEmploymentToGather', () => {
        req.session.editSection = 'not-employment';
        employmentExpenses(req, res, next);
        assert(addEmploymentToGather.calledOnce);
      });
    });
  });
  describe('when expenses does not equal \'no\'', () => {
    it('should do nothing', () => {
      req.journeyData.getDataForPage = () => ({});
      employmentExpenses(req, res, next);
      assert(updateSpecificEmployment.notCalled);
      assert(addEmploymentToGather.notCalled);
    });
  });
});
