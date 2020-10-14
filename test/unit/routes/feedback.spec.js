const { assert, expect } = require('chai');
const rewire = require('rewire');
const sinon = require('sinon');

const feedback = rewire('../../../app/routes/feedback.js');

describe('Feedback routes', () => {
  const res = {
    status: () => ({
      redirect: () => {},
      render: () => {},
    }),
  };
  const router = {};
  const req = {
    csrfToken: () => '',
    headers: {
      referer: 'https://localhost:3000/',
    },
  };
  it('should set up a GET route and render the feedback page', (done) => {
    res.render = (template, viewOptions) => {
      assert.equal(template, 'pages/feedback.njk');
      expect(viewOptions).to.have.property('csrfToken');
      expect(viewOptions).to.have.property('feedbackPath');
      expect(viewOptions).to.have.property('referringPage');
      done();
    };
    router.get = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/feedback');
      callback(req, res);
    };
    router.post = () => {};
    feedback(router);
  });
  it('should set the referring page to "index" if the page is empty', (done) => {
    res.render = (template, viewOptions) => {
      assert.equal(template, 'pages/feedback.njk');
      expect(viewOptions).property('referringPage').to.equal('index');
      done();
    };
    router.get = (path, csrfMiddleware, callback) => {
      callback(req, res);
    };
    router.post = () => {};
    feedback(router);
  });
  it('should set the referring page to correct page', (done) => {
    req.headers.referer = 'https://localhost:3000/conditions';
    res.render = (template, viewOptions) => {
      assert.equal(template, 'pages/feedback.njk');
      expect(viewOptions).property('referringPage').to.equal('conditions');
      done();
    };
    router.get = (path, csrfMiddleware, callback) => {
      callback(req, res);
    };
    router.post = () => {};
    feedback(router);
  });
  it('should set up a POST route and redirect to thankyou page if all req.body fields are present', (done) => {
    const notifyEmail = sinon.stub().resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    feedback.__set__('notifyEmail', notifyEmail);
    try {
      req.body = {
        referringPage: 'severe-condition',
        rating: 'Satisfied',
        comments: 'Good service',
      };
      res.redirect = (path) => {
        assert.equal(path, '/thankyou');
        done();
      };
      router.get = () => {};
      router.post = (path, csrfMiddleware, callback) => {
        assert.equal(path, '/feedback');
        callback(req, res);
      };
      feedback(router);
    } catch (e) {
      done(e);
    }
  });
  it('should set up a POST route and redirect to thankyou page if rating field is not present', (done) => {
    const notifyEmail = sinon.stub().resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    feedback.__set__('notifyEmail', notifyEmail);
    try {
      req.body = {
        referringPage: 'severe-condition',
        rating: '',
        comments: 'Good service',
      };
      res.redirect = (path) => {
        assert.equal(path, '/thankyou');
        done();
      };
      router.get = () => {};
      router.post = (path, csrfMiddleware, callback) => {
        assert.equal(path, '/feedback');
        callback(req, res);
      };
      feedback(router);
    } catch (e) {
      done(e);
    }
  });
  it('should set up a POST route and redirect to thankyou page if comments field is not present', (done) => {
    const notifyEmail = sinon.stub().resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    feedback.__set__('notifyEmail', notifyEmail);
    try {
      req.body = {
        referringPage: 'severe-condition',
        rating: 'Dissatisfied',
        comments: '',
      };
      res.redirect = (path) => {
        assert.equal(path, '/thankyou');
        done();
      };
      router.get = () => {};
      router.post = (path, csrfMiddleware, callback) => {
        assert.equal(path, '/feedback');
        callback(req, res);
      };
      feedback(router);
    } catch (e) {
      done(e);
    }
  });
  it('should rerender feedback page with error if both rating and comments are empty', (done) => {
    const notifyEmail = sinon.stub().resolves();
    /* eslint-disable-next-line no-underscore-dangle */
    feedback.__set__('notifyEmail', notifyEmail);
    try {
      req.i18nTranslator = { t: () => {} };
      req.body = {
        referringPage: 'severe-condition',
        rating: '',
        comments: '',
      };
      res.render = (path, options) => {
        assert.equal(path, 'pages/feedback.njk');
        assert.equal(options.feedbackPath, true);
        assert.equal(options.formErrors[0].field, 'feedback-group');
        done();
      };
      router.get = () => {};
      router.post = (path, csrfMiddleware, callback) => {
        assert.equal(path, '/feedback');
        callback(req, res);
      };
      feedback(router);
    } catch (e) {
      done(e);
    }
  });
  it('should render the errors/500.njk page if it catches a notify error', (done) => {
    const notifyEmail = sinon.stub().rejects();
    /* eslint-disable-next-line no-underscore-dangle */
    feedback.__set__('notifyEmail', notifyEmail);
    try {
      req.body = {
        referringPage: 'severe-condition',
        rating: 'Satisfied',
        comments: 'Good service',
      };
      router.get = () => {};
      res.status = () => ({
        render: (template) => {
          assert.equal(template, 'casa/errors/500.njk');
          done();
        },
      });
      router.post = (path, csrfMiddleware, callback) => {
        assert.equal(path, '/feedback');
        callback(req, res);
      };
      feedback(router);
    } catch (e) {
      done(e);
    }
  });
});
