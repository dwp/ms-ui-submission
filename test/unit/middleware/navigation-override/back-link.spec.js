import sinon from 'sinon';

import { expect } from 'chai';

import { JourneyContext } from '@dwp/govuk-casa';
import backLink from '../../../../src/middleware/navigation-override/back-link.js';
let sandbox;


describe('backLink', () => {
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext').resolves();
    });
    afterEach(() => {
        sandbox.restore();
    });
  let req;
  let next;
  beforeEach(() => {
    req = {
      session: {
        backClicked: true,
        save: sinon.stub(),
        nextBackLink: '/previous-page',
      },
      casa: {
        journeyContext: sinon.stub()
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
