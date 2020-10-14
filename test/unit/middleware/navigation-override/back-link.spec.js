const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;

const backLink = require('../../../../app/middleware/navigation-override/back-link');

describe('backLink', () => {
  let req;
  let next;
  beforeEach(() => {
    req = {
      session: {
        backClicked: true,
        nextBackLink: '/previous-page',
      },
      path: '/this-page',
    };
    next = sinon.stub();
  });
  it('should reset the history stack if nextBackLink is \'/session-timeout\'', () => {
    req.session.nextBackLink = '/session-timeout';
    backLink(req, null, next);
    expect(req.session.historyStack).to.eql([]);
  });
  it('should set the nextBackLink to the current request path', () => {
    backLink(req, null, next);
    expect(req.session.nextBackLink).to.equal(req.path);
  });
  it('should remove the backClicked property from the session', () => {
    backLink(req, null, next);
    expect(req.session.backClicked).to.equal(undefined);
  });
  describe('when req.session.backClicked is true', () => {
    beforeEach(() => {
      req.session.backClicked = false;
    });
    it('should set up the history stack as an empty array', () => {
      backLink(req, null, next);
      expect(req.session.historyStack).to.eql([{ path: '/previous-page' }]);
    });
    it('should set up the history stack as an empty array', () => {
      req.session.nextBackLink = undefined;
      backLink(req, null, next);
      expect(req.session.historyStack).to.eql([]);
    });
  });
});
