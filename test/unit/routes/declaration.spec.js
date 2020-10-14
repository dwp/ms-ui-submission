const { assert, expect } = require('chai');
const declarationRoute = require('../../../app/routes/declaration.js');

describe('Declaration routes', () => {
  const mountUrl = '/';
  const req = {
    csrfToken: () => '',
    i18nTranslator: ({
      t: () => this,
      getLanguage: () => 'en',
    }),
    session: {
      save: (cb) => {
        cb(new Error('save error'));
      },
      applicationRef: 'test',
      journeyData: {
        getDataForPage: () => ({
          conditions: [],
          nino: 'test',
          sortCode: {
            sortCode: '010101',
          },
          accountNumber: '01 01 01 01',
          claimStartDate: {
            dd: '1',
            mm: '1',
            yyyy: '1111',
          },
          dateOfBirth: {
            dd: '1',
            mm: '1',
            yyyy: '1111',
          },
          address: {
            address1: 'test',
            address2: 'test',
            address3: 'test',
            postcode: 'test',
          },
        }),
        mobile: {
          mobile: 'yes',
          number: '01111111111',
          replace: {},
        },
      },
    },
    journeyData: {
      getDataForPage: () => ({
        conditions: [],
        nino: 'test',
        sortCode: {
          sortCode: '010101',
        },
        accountNumber: '01 01 01 01',
        claimStartDate: {
          dd: '1',
          mm: '1',
          yyyy: '1111',
        },
        dateOfBirth: {
          dd: '1',
          mm: '1',
          yyyy: '1111',
        },
        address: {
          address1: 'test',
          address2: 'test',
          address3: 'test',
          postcode: 'test',
        },
      }),
    },
  };
  const res = {
    status: () => ({
      render: () => {},
    }),
  };
  const router = {};
  const csrf = '';
  const submissionService = {
    sendApplication: () => Promise.resolve({
      statusCode: 200,
    }),
  };
  const notificationService = {
    sendNotification: () => Promise.resolve({
      statusCode: 202,
    }),
  };

  it('should set up a GET route, and render the declaration page when called with cya page already visited', () => {
    res.render = (template, viewOptions) => {
      assert.equal(template, 'pages/declaration.njk');
      expect(viewOptions).to.have.property('csrfToken');
    };
    router.get = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/declaration');
      req.session.cyaVisited = true;
      callback(req, res);
    };
    router.post = () => {};
    declarationRoute(mountUrl, router, csrf);
  });

  it('should redirect to check-your-answers page when declaration page called without visiting cya page', () => {
    res.status = (statusCode) => ({
      redirect: (path) => {
        assert.equal(path, '/check-your-answers');
        assert.equal(statusCode, 302);
      },
    });
    router.get = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/declaration');
      callback(req, res);
    };
    router.post = () => {};
    declarationRoute(mountUrl, router, csrf);
  });

  it('should set up a POST route, and redirect to the complete page when submission service successful', (done) => {
    res.status = (statusCode) => ({
      redirect: (path) => {
        try {
          assert.equal(path, '/complete');
          assert.equal(statusCode, 302);
          done();
        } catch (e) {
          done(e);
        }
      },
    });
    router.get = () => {};
    router.post = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/declaration');
      callback(req, res);
    };
    declarationRoute(mountUrl, router, csrf, submissionService, notificationService);
  });

  it('should display an error page if submission handler doesn\'t accept the app', (done) => {
    res.status = (statusCode) => ({
      render: (path) => {
        try {
          assert.equal(path, 'casa/errors/500-submission-error.njk');
          assert.equal(statusCode, 500);
          done();
        } catch (e) {
          done(e);
        }
      },
    });
    router.get = () => {};
    router.post = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/declaration');
      callback(req, res);
    };
    const badSubmissionService = {
      sendApplication: () => Promise.resolve({
        statusCode: 400,
      }),
    };
    declarationRoute(mountUrl, router, csrf, badSubmissionService, notificationService);
  });

  it('should route to the complete page if submission handler doesn\'t accept application because it\'s a duplicate submission', (done) => {
    res.status = (statusCode) => ({
      redirect: (path) => {
        try {
          assert.equal(path, '/complete');
          assert.equal(statusCode, 302);
          done();
        } catch (e) {
          done(e);
        }
      },
    });
    router.get = () => {};
    router.post = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/declaration');
      callback(req, res);
    };
    const badSubmissionService = {
      // eslint-disable-next-line prefer-promise-reject-errors
      sendApplication: () => Promise.reject({
        statusCode: 409,
      }),
    };
    declarationRoute(mountUrl, router, csrf, badSubmissionService, notificationService);
  });
  it('should display an error page if submission handler isn\'t working', (done) => {
    res.status = (statusCode) => ({
      render: (path) => {
        try {
          assert.equal(path, 'casa/errors/500-submission-error.njk');
          assert.equal(statusCode, 500);
          done();
        } catch (e) {
          done(e);
        }
      },
    });
    router.get = () => {};
    router.post = (path, csrfMiddleware, callback) => {
      assert.equal(path, '/declaration');
      callback(req, res);
    };
    const badSubmissionService = {
      sendApplication: () => Promise.reject(new Error('something bad happened')),
    };
    declarationRoute(mountUrl, router, csrf, badSubmissionService, notificationService);
  });
});
