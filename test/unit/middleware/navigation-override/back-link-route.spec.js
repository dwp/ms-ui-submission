import * as chai from 'chai';
import { assert, expect } from 'chai';
import sinon from 'sinon';
import sinonChai from "sinon-chai";
chai.use(sinonChai);

import backLinkRoute from '../../../../src/middleware/navigation-override/back-link-route.js';

describe('backLinkRoute', () => {
  let router;
  let req;
  let res;
  beforeEach(() => {
    router = {
      get: (path, cb) => {
        cb();
      },
    };
    req = {
      session: {
        backClicked: false,
        historyStack: [{ path: '/last-page' }],
        nextBackLink: '/previous-page',
        save: sinon.stub().yields(),
      },
      casa: {
        journeyContext: {
          data: {}
        },
      },
      path: '/this-page',
      get: sinon.stub().returns('http://localhost:3000/thispage'),
      headers: {
        host: 'localhost:3000',
      },
    };
    res = {
      status: sinon.stub().returns({
        redirect: sinon.stub(),
      }),
    };
    router.get = (path, cb) => {
      cb(req, res);
    };
  });
  it('should call get with a value of \'/path\'', () => {
    router.get = (path) => {
      expect(path).to.equal('/back');
    };
    backLinkRoute.backLinkRoute(router);
  });
  describe('if there are entries in the historyStack', () => {
    beforeEach(() => {
      backLinkRoute.backLinkRoute(router);
    });
    it('should pop the last entry from the history stack', () => {
      expect(req.session.historyStack.length).to.equal(0);
    });
    it('should set req.session.backClicked should be set to true', () => {
      expect(req.session.backClicked).to.equal(true);
    });
    it('should call req.session.save()', () => {
      assert(req.session.save.called);
    });
    it('should redirect to \'/last-page\'', () => {
      assert(res.status.called);
      assert(res.status().redirect.called);
    });
  });
  describe('if there are no entries in the historyStack', () => {
    beforeEach(() => {
      req.session.historyStack = [];
    });
    it('should redirect to the result of req.get(\'Referrer\') if on the same domain', () => {
      backLinkRoute.backLinkRoute(router);
      expect(req.session.historyStack.length).to.equal(0);
      expect(req.session.backClicked).to.equal(false);
      assert(req.session.save.notCalled);
      expect(res.status().redirect).to.have.been.calledWith('http://localhost:3000/thispage');
      assert(req.get.called);
    });
    it('should redirect to the result of req.get(\'Referrer\') if not this domain', () => {
      req.headers.host = 'notlocalhost:3000';
      backLinkRoute.backLinkRoute(router);
      expect(req.session.backClicked).to.equal(false);
      assert(req.session.save.notCalled);
      expect(res.status().redirect).to.have.been.calledWith('/');
      assert(req.get.called);
    });
  });
});
