import { assert, expect } from 'chai';
import cyaRoute from '../../../src/routes/check-your-answers.js';
import { JourneyContext } from '@dwp/govuk-casa';
import sinon from "sinon";

let sandbox;

describe('Check your answer routes', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(JourneyContext, 'putContext');
  });
  afterEach(() => {
    sandbox.restore();
  });
  const res = {
    status: () => ({
      render: () => {},
    }),
  };
  const router = {};
  const next = () => {};

  it('should set up a GET route, and render the check-your-answers page when called', () => {
    res.render = (template, viewOptions) => {
      assert.equal(template, 'pages/check-your-answers.njk');
      expect(viewOptions).to.have.property('csrfToken');
    };
    router.get = (path, railsMiddleware, csrfMiddleware, callback) => {
      assert.equal(path, '/check-your-answers');
      callback({
        csrfToken: () => {},
        session: {
          save: () => {},
        },
        casa: {
          journeyContext: {
            setDataForPage: () => {},
            getData: () => {},
            data: {
              'statutory-sick-pay-end': '10/10/2001',
            },
          },
        },
        query: {},
      }, res);
    };
    router.post = () => {};
    cyaRoute(router, {}, '/', null);
  });

  it('should set up a POST route, and redirect to the declaration if reviewed', () => {
    res.status = (statusCode) => ({
      redirect: (path) => {
        assert.equal(path, '/declaration');
        assert.equal(statusCode, 302);
      },
    });
    router.get = () => {};
    router.post = (path, railsMiddleware, csrfMiddleware, callback) => {
      assert.equal(path, '/check-your-answers');
      callback({
        body: {
          reviewed: 'true',
        },
        casa: {
          journeyContext: {
            data: () => {},
          },
        },
        session: {
          save: () => {},
        },
      }, res, next);
    };
    cyaRoute(router, {}, '/', null);
  });

  it('should edit voluntary section if change link is clicked on voluntary section', () => {
    const req = {
      query: {
        page: 'voluntary-work-role',
        index: '0',
      },
      session: {
        voluntaryGather: [{}],
        save: () => {},
      },
      casa: {
        journeyContext: {
          data: () => {},
          setDataForPage: () => {},
        },
      },
    };
    res.status = (statusCode) => ({
      redirect: (path) => {
        assert.equal(path, '/voluntary-work?edit');
        assert.equal(statusCode, 302);
        assert.equal(req.session.editIndex, '0');
        assert.equal(req.session.editPage, 'voluntary-work-role');
        assert.equal(req.session.editSection, 'voluntary');
      },
    });
    router.get = (path, railsMiddleware, csrfMiddleware, callback) => {
      assert.equal(path, '/check-your-answers');
      callback(req, res);
    };
    router.post = () => {};
    cyaRoute(router, {}, '/', null);
  });

  it('should edit insurance section if change link is clicked on insurance section', () => {
    const req = {
      query: {
        page: 'insurance-details',
        index: '0',
      },
      session: {
        insuranceGather: [{}],
        save: () => {},
      },
      casa: {
        journeyContext: {
          data: () => {},
          setDataForPage: () => {},
        },
      },
    };
    res.status = (statusCode) => ({
      redirect: (path) => {
        assert.equal(path, '/insurance-details?edit');
        assert.equal(statusCode, 302);
        assert.equal(req.session.editIndex, '0');
        assert.equal(req.session.editPage, 'insurance-details');
        assert.equal(req.session.editSection, 'insurance');
      },
    });
    router.get = (path, railsMiddleware, csrfMiddleware, callback) => {
      assert.equal(path, '/check-your-answers');
      callback(req, res);
    };
    router.post = () => {};
    cyaRoute(router, {}, '/', null);
  });

  it('should edit pension section if change link is clicked on pension section', () => {
    const req = {
      query: {
        page: 'pension-details',
        index: '0',
      },
      session: {
        pensionGather: [{}],
        save: () => {},
      },
      casa: {
        journeyContext: {
          data: () => {},
          setDataForPage: () => {},
        },
      },
    };
    res.status = (statusCode) => ({
      redirect: (path) => {
        assert.equal(path, '/pension-details?edit');
        assert.equal(statusCode, 302);
        assert.equal(req.session.editIndex, '0');
        assert.equal(req.session.editPage, 'pension-details');
        assert.equal(req.session.editSection, 'pension');
      },
    });
    router.get = (path, railsMiddleware, csrfMiddleware, callback) => {
      assert.equal(path, '/check-your-answers');
      callback(req, res);
    };
    router.post = () => {};
    cyaRoute(router, {}, '/', null);
  });

  it('should edit employment section if change link is clicked on employment section', () => {
    const req = {
      query: {
        page: 'employment-details',
        index: '0',
      },
      session: {
        employmentGather: [{ workTypes: ['employed'] }],
        save: () => {},
      },
      casa: {
        journeyContext: {
          data: {
            employed : { other: 'yes', employed : 'yes' } 
          },
          setDataForPage: () => {},
        },
      },
    };
    res.status = (statusCode) => ({
      redirect: (path) => {
        assert.equal(path, '/employment-details?edit');
        assert.equal(statusCode, 302);
        assert.equal(req.session.editIndex, '0');
        assert.equal(req.session.editPage, 'employment-details');
        assert.equal(req.session.editSection, 'employment');
      },
    });
    router.get = (path, railsMiddleware, csrfMiddleware, callback) => {
      assert.equal(path, '/check-your-answers');
      callback(req, res);
    };
    router.post = () => {};
    cyaRoute(router, {}, '/', null);
  });

  it('should remove voluntary section if remove link is clicked on voluntary section', () => {
    const req = {
      query: {
        page: 'voluntary',
        index: '0',
      },
      session: {
        voluntaryGather: [{}],
        save: (cb) => {
          cb();
        },
      },
      casa: {
        journeyContext: {
          data: () => {},
          setDataForPage: () => {},
        },
      },
    };
    res.status = (statusCode) => ({
      redirect: (path) => {
        assert.equal(path, '/remove');
        assert.equal(statusCode, 302);
        assert.equal(req.session.removeIndex, '0');
        assert.equal(req.session.removeSection, 'voluntary');
      },
    });
    router.get = (path, railsMiddleware, csrfMiddleware, callback) => {
      assert.equal(path, '/check-your-answers');
      callback(req, res);
    };
    router.post = () => {};
    cyaRoute(router, {}, '/', null);
  });

  it('should abort if unexpected values are POSTed', () => {
    const req = {
      body: {
        page: 'test',
        index: '0',
      },
      session: {},
    };
    res.status = (statusCode) => ({
      redirect: (path) => {
        assert.equal(path, '/check-your-answers');
        assert.equal(statusCode, 302);
        assert.equal(req.session.editIndex, null);
        assert.equal(req.session.editPage, null);
        assert.equal(req.session.editSection, null);
      },
    });
    router.get = () => {};
    router.post = (path, railsMiddleware, csrfMiddleware, callback) => {
      assert.equal(path, '/check-your-answers');
      callback(req, res);
    };
    cyaRoute(router, {}, '/', null);
  });

  it('should remove sections if values are POSTed', () => {
    const req = {
      body: {
        remove: 'voluntary',
        index: '0',
      },
      session: {
        voluntaryGather: [{}],
        save: () => {},
      },
    };
    res.status = (statusCode) => ({
      redirect: (path) => {
        assert.equal(path, '/remove');
        assert.equal(statusCode, 302);
        assert.equal(req.session.removeSection, 'voluntary');
        assert.equal(req.session.removeIndex, '0');
      },
    });
    router.get = () => {};
    router.post = (path, railsMiddleware, csrfMiddleware, callback) => {
      assert.equal(path, '/check-your-answers');
      callback(req, res);
    };
    cyaRoute(router, {}, '/', null);
  });

  it('should abort if unexpected remove values are POSTed', () => {
    const req = {
      body: {
        remove: 'test',
        index: '0',
      },
      session: {},
    };
    res.status = (statusCode) => ({
      redirect: (path) => {
        assert.equal(path, '/check-your-answers');
        assert.equal(statusCode, 302);
      },
    });
    router.get = () => {};
    router.post = (path, railsMiddleware, csrfMiddleware, callback) => {
      assert.equal(path, '/check-your-answers');
      callback(req, res);
    };
    cyaRoute(router, {}, '/', null);
  });
});
