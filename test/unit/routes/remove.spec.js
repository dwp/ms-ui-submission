const { assert, expect } = require('chai');
const remove = require('../../../app/routes/remove.js');

describe('Remove routes', () => {
  const res = {
    status: () => ({
      redirect: () => {},
    }),
  };
  const router = {};

  it('should set up a GET route, and render the remove page', () => {
    const req = {
      csrfToken: () => '',
      session: {
        removeSection: 'voluntary',
        removeIndex: '0',
        voluntaryGather: [{}],
        save: () => {},
      },
      journeyData: {
        getDataForPage: () => {},
      },
    };
    res.render = (template, viewOptions) => {
      assert.equal(template, 'pages/remove.njk');
      expect(viewOptions).to.have.property('csrfToken');
    };
    router.get = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/remove');
      callback(req, res);
    };
    router.post = () => {};
    remove(router, {});
  });

  it('should redirect to check-your-answers if unexpected values are present', () => {
    const req = {
      csrfToken: () => '',
      session: {
        removeSection: 'test',
        removeIndex: '0',
        voluntaryGather: [{}],
        save: () => {},
      },
    };
    res.status.redirect = (path) => {
      assert.equal(path, '/check-your-answers');
    };
    router.get = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/remove');
      callback(req, res);
    };
    router.post = () => {};
    remove(router, {});
  });

  it('should set up a POST route, and redirect to the removed page', () => {
    const req = {
      csrfToken: () => '',
      body: {
        remove: 'yes',
      },
      session: {
        removeSection: 'employment',
        removeIndex: '0',
        employmentGather: [{}],
        journeyData: {},
        save: () => {},
      },
      journeyData: {
        getDataForPage: () => ({
          ssp: 'yes',
        }),
        setDataForPage: () => {},
      },
    };
    res.status = (statusCode) => ({
      redirect: (path) => {
        assert.equal(path, '/removed');
        assert.equal(statusCode, 302);
      },
    });
    router.get = () => {};
    router.post = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/remove');
      callback(req, res);
    };
    remove(router, {});
  });

  it('should redirect to check-your-answers when aborting the removal', () => {
    const req = {
      csrfToken: () => '',
      body: {
        remove: 'no',
      },
    };
    res.status = (statusCode) => ({
      redirect: (path) => {
        assert.equal(path, '/check-your-answers');
        assert.equal(statusCode, 302);
      },
    });
    router.get = () => {};
    router.post = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/remove');
      callback(req, res);
    };
    remove(router, {});
  });

  it('should render errors if it fails validation', () => {
    const req = {
      csrfToken: () => '',
      body: {
        test: 'test',
      },
      session: {
        removeSection: 'employment',
        removeIndex: '0',
        employmentGather: [{}],
        journeyData: {},
        save: () => {},
      },
    };
    res.render = (template) => {
      assert.equal(template, 'pages/remove.njk');
    };
    router.get = () => {};
    router.post = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/remove');
      callback(req, res);
    };
    remove(router, {});
  });
});
