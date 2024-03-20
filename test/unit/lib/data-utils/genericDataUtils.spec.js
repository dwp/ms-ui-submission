import sinon from 'sinon';
import { assert, expect } from 'chai';
import genericDataUtils from '../../../../src/lib/data-utils/genericDataUtils.js';
import employmentDataDefault from '../../../../src/lib/data-utils/employmentDataUtils.js';
import voluntaryDataDefault from '../../../../src/lib/data-utils/voluntaryDataUtils.js';

describe('genericDataUtils.convertToArrayAndFilterBlanks', () => {
  it('should exist', () => {
    expect(genericDataUtils.convertToArrayAndFilterBlanks).to.be.a('function');
  });

  it('should return undefined when passed no args', () => {
    expect(genericDataUtils.convertToArrayAndFilterBlanks()).to.equal(undefined);
  });

  it('should covert objects to arrays', () => {
    const obj = { a: 'a' };
    expect(genericDataUtils.convertToArrayAndFilterBlanks(obj)).to.eql(['a']);
  });

  it('should check nested objects', () => {
    const arr = [{
      a: 'a',
      b: {
        c: 'c',
      },
    }, {
      a: '',
      b: {
        c: '',
      },
    }];
    expect(genericDataUtils.convertToArrayAndFilterBlanks(arr).length).to.equal(1);
  });

  it('should not remove non empty objects', () => {
    const arr = [{
      a: 'a',
      b: 'b',
    }, {
      a: 'a',
      b: 'b',
    }, {
      a: 'a',
      b: 'b',
    }, {
      a: 'a',
      b: 'b',
    }];
    expect(genericDataUtils.convertToArrayAndFilterBlanks(arr)).to.deep.equal(arr);
  });

  it('should not remove partially empty objects', () => {
    const arr = [{
      a: 'a',
      b: 'b',
    }, {
      a: '',
      b: 'b',
    }, {
      a: 'a',
      b: 'b',
    }, {
      a: 'a',
      b: '',
    }];
    expect(genericDataUtils.convertToArrayAndFilterBlanks(arr)).to.deep.equal(arr);
  });

  it('should remove empty objects', () => {
    const arr = [{
      a: '',
      b: '',
    }, {
      a: 'a',
      b: 'b',
    }, {
      a: '',
      b: '',
    }, {
      a: 'a',
      b: '',
    }];
    expect(genericDataUtils.convertToArrayAndFilterBlanks(arr)).to.deep.equal([{
      a: 'a',
      b: 'b',
    }, {
      a: 'a',
      b: '',
    }]);
  });
});

describe('genericDataUtils.deleteIfPresent', () => {
  it('should exist', () => {
    expect(genericDataUtils.deleteIfPresent).to.be.a('function');
  });

  it('should return false if there is no data for the page provided', () => {
    const page = 'pensions-payment';
    const dataItems = [];
    const req = {
      casa: {
        journeyContext: {
          data: {},
        },
      },
    };
    expect(genericDataUtils.deleteIfPresent(req, page, dataItems)).to.equal(false);
  });
});

describe('genericDataUtils.cancelEdit', () => {
  let req;
  beforeEach(() => {
    req = {
      session: {
        editSection: '',
        editIndex: 0,
        voluntaryGather: [],
        employmentGather: [],
        pensionGather: [],
        insuranceGather: [],
      },
      casa: {
        journeyContext: {
          data: {},
          getData: (p) => {
            req.casa.journeyContext[p] = req.session.editSection;
          },
        },
      },
    };
  });
  it('should set values for voluntary work if editSection is voluntary', () => {
    req.session.editSection = 'voluntary';
    req.session.voluntaryGather[0] = 'voluntaryData';
    const sandbox = sinon.createSandbox();
    sandbox.stub(voluntaryDataDefault, 'getVoluntaryFromJourneyData').returns('voluntaryData');
    sandbox.stub(voluntaryDataDefault, 'clearVoluntaryJourneyData').resolves();
    genericDataUtils.cancelEdit(req);
    assert(voluntaryDataDefault.getVoluntaryFromJourneyData.calledOnce);
    sandbox.restore();
  });
  it('should not set values for voluntary work if editSection is voluntary', () => {
    req.session.editSection = 'voluntary';
    req.session.voluntaryGather[0] = 'notVoluntaryData';
    const sandbox = sinon.createSandbox();
    sandbox.stub(voluntaryDataDefault, 'getVoluntaryFromJourneyData').returns('voluntaryData');
    sandbox.stub(voluntaryDataDefault, 'clearVoluntaryJourneyData').resolves();
    genericDataUtils.cancelEdit(req);
    assert(voluntaryDataDefault.getVoluntaryFromJourneyData.calledOnce);
    assert(voluntaryDataDefault.clearVoluntaryJourneyData.notCalled);
    sandbox.restore();
  });
  it('should set values for paid work if editSection is employment', () => {
    req.session.editSection = 'employment';
    req.session.employmentGather[0] = 'employmentData';
    const sandbox = sinon.createSandbox();
    sandbox.stub(employmentDataDefault, 'getEmploymentFromJourneyData').returns('employmentData');
    genericDataUtils.cancelEdit(req);
    assert(employmentDataDefault.getEmploymentFromJourneyData.calledOnce);
    sandbox.restore();
  });
  it('should not set values for paid work if editSection is employment', () => {
    req.session.editSection = 'employment';
    req.session.employmentGather[0] = 'notEmploymentData';
    const sandbox = sinon.createSandbox();
    sandbox.stub(employmentDataDefault, 'getEmploymentFromJourneyData').returns('employmentData');
    genericDataUtils.cancelEdit(req);
    assert(employmentDataDefault.getEmploymentFromJourneyData.calledOnce);
    sandbox.restore();
  });
});
