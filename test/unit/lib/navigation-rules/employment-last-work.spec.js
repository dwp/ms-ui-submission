const chai = require('chai');
const sinon = require('sinon');

const { assert } = chai;
const { employmentDataUtils } = require('../../../../app/lib/data-utils');
const employmentLastWork = require('../../../../app/lib/navigation-rules/employment-last-work');

describe('employment last work navigation rules', () => {
  let req;
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
        getDataForPage: (page) => {
          if (page === 'employment-off-sick') {
            return {
              offSick: 'no',
            };
          }
          return undefined;
        },
      },
      session: {
        editPage: 'employment-last-work',
        editSection: 'employment',
      },
    };
  });
  it('should call updateSpecificEmployment if editSection is employment and the editPage is employment-last-work but offsick is no', () => {
    employmentLastWork(req);
    assert(updateSpecificEmployment.called);
    assert(addEmploymentToGather.notCalled);
  });
  it('should call updateSpecificEmployment if editSection is employment, offsick is yes but the page is not employment-status', () => {
    req.journeyData.getDataForPage = (page) => {
      if (page === 'employment-off-sick') {
        return {
          offSick: 'yes',
        };
      }
      return undefined;
    };
    req.session.editPage = 'some-other-page';
    employmentLastWork(req);
    assert(updateSpecificEmployment.called);
    assert(addEmploymentToGather.notCalled);
  });
  it('should not call anything if editSection is employment, offsick is no and the page is not employment-status', () => {
    req.session.editPage = 'some-other-page';
    employmentLastWork(req);
    assert(updateSpecificEmployment.notCalled);
    assert(addEmploymentToGather.notCalled);
  });
  it('should call addEmploymentToGather if editSection is not employment but offsick is yes', () => {
    req.session.editSection = 'not-employment';
    req.journeyData.getDataForPage = (page) => {
      if (page === 'employment-off-sick') {
        return {
          offSick: 'yes',
        };
      }
      return undefined;
    };
    employmentLastWork(req);
    assert(updateSpecificEmployment.notCalled);
    assert(addEmploymentToGather.called);
  });
  it('should not do anything if editSection is not employment and offsick is not yes', () => {
    delete req.session.editSection;
    employmentLastWork(req);
    assert(updateSpecificEmployment.notCalled);
    assert(addEmploymentToGather.notCalled);
  });
});
